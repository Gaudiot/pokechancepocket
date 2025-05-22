package collections_router

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"pokechancepocket/base/google"
	"slices"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

func CollectionsRouteHandler() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/collection/pullchance/", GetPullChancefunc)
	mux.HandleFunc("/collection/", GetCollectionCardsfunc)
	mux.HandleFunc("/collections/", GetCollectionsfunc)
	return mux
}

func GetCollectionsfunc(w http.ResponseWriter, r *http.Request) {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Erro ao carregar variáveis de ambiente: %v", err)
	}

	spreadsheetId := os.Getenv("POKECHANCE_GOOGLE_SHEET_ID")
	googleSheets := google.NewGoogleSheets()
	sheetNames, err := googleSheets.GetSheetNames(spreadsheetId)
	if err != nil {
		log.Fatalf("Erro ao obter nomes das planilhas: %v", err)
	}

	response := make(map[string]string)
	for _, sheetName := range sheetNames {
		collectionName, err := googleSheets.GetCellValue(spreadsheetId, sheetName, 24, "U")
		if err != nil {
			log.Fatalf("Erro ao obter o nome da coleção: %v", err)
		}
		response[sheetName] = collectionName
	}

	json.NewEncoder(w).Encode(map[string]interface{}{"collections": response})
}

func GetPullChancefunc(w http.ResponseWriter, r *http.Request) {
	collectionId := strings.TrimPrefix(r.URL.Path, "/collection/pullchance/")
	if collectionId == "" {
		http.Error(w, "ID da coleção não informado", http.StatusBadRequest)
		return
	}
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Erro ao carregar variáveis de ambiente: %v", err)
	}

	ownedParam := r.URL.Query().Get("owned")
	owned := make([]int, 0)

	if ownedParam != "" {
		for r := range strings.SplitSeq(ownedParam, ",") {
			if strings.Contains(r, "-") {
				// Processa intervalos (ex: "1-13")
				bounds := strings.Split(r, "-")
				if len(bounds) != 2 {
					http.Error(w, "Formato inválido no parâmetro 'owned'", http.StatusBadRequest)
					return
				}

				start, err := strconv.Atoi(bounds[0])
				if err != nil {
					http.Error(w, "Formato inválido no parâmetro 'owned'", http.StatusBadRequest)
					return
				}

				end, err := strconv.Atoi(bounds[1])
				if err != nil {
					http.Error(w, "Formato inválido no parâmetro 'owned'", http.StatusBadRequest)
					return
				}

				for i := start; i <= end; i++ {
					owned = append(owned, i)
				}
			} else {
				// Processa números individuais
				num, err := strconv.Atoi(r)
				if err != nil {
					http.Error(w, "Formato inválido no parâmetro 'owned'", http.StatusBadRequest)
					return
				}
				owned = append(owned, num)
			}
		}

		slices.Sort(owned)
	}

	spreadsheetId := os.Getenv("POKECHANCE_GOOGLE_SHEET_ID")
	googleSheets := google.NewGoogleSheets()
	values, err := googleSheets.GetAllValues(spreadsheetId, collectionId)
	if err != nil {
		log.Fatalf("[getPackTypes] Erro ao obter os valores da planilha: %v", err)
	}

	packTypes := getPackTypes(values)
	pullChances := make(map[string]float64)
	for _, packType := range packTypes {
		pullchance := newPullChance(values, packType, owned)
		pullChances[packType] = pullchance * 100
	}
	json.NewEncoder(w).Encode(map[string]map[string]float64{"pullchances": pullChances})
}

func getPackTypes(values [][]string) []string {
	packTypes := []string{}
	packTypes = append(packTypes, values[16]['P'-'A'])
	packTypes = append(packTypes, values[16]['Q'-'A'])
	packTypes = append(packTypes, values[16]['R'-'A'])

	packTypes = slices.DeleteFunc(packTypes, func(s string) bool {
		return s == ""
	})
	return packTypes
}

func sumColumn(values [][]string, column rune, rarity string, packType string, owned []int) float64 {
	result := 0.0
	for _, row := range values {
		cardId, _ := strconv.Atoi(row[0])
		if row[4] == rarity && (row[5] == packType || row[5] == "All") && !slices.Contains(owned, cardId) {
			// Remove o símbolo % do final da string
			valueStr := strings.TrimSuffix(row[column-'A'], "%")
			value, err := strconv.ParseFloat(valueStr, 64)
			if err != nil {
				println("error", err)
				continue
			}
			// Converte de porcentagem para decimal (divide por 100)
			result += value / 100
		}
	}
	return result
}

func newPullChance(values [][]string, packType string, owned []int) float64 {
	firstCardDefault := sumColumn(values, 'H', "Default", packType, owned)
	firstCardRare := sumColumn(values, 'H', "Rare", packType, owned)

	secondCardDefault := sumColumn(values, 'I', "Default", packType, owned)
	secondCardRare := sumColumn(values, 'I', "Rare", packType, owned)

	thirdCardDefault := sumColumn(values, 'J', "Default", packType, owned)
	thirdCardRare := sumColumn(values, 'J', "Rare", packType, owned)

	fourthCardDefault := sumColumn(values, 'K', "Default", packType, owned)
	fourthCardRare := sumColumn(values, 'K', "Rare", packType, owned)

	fifthCardDefault := sumColumn(values, 'L', "Default", packType, owned)
	fifthCardRare := sumColumn(values, 'L', "Rare", packType, owned)

	newCardDefault := (1 - (1-firstCardDefault)*(1-secondCardDefault)*(1-thirdCardDefault)*(1-fourthCardDefault)*(1-fifthCardDefault))
	newCardRare := (1 - (1-firstCardRare)*(1-secondCardRare)*(1-thirdCardRare)*(1-fourthCardRare)*(1-fifthCardRare))

	return 0.9995*newCardDefault + 0.0005*newCardRare
}

func GetCollectionCardsfunc(w http.ResponseWriter, r *http.Request) {
	collectionId := strings.TrimPrefix(r.URL.Path, "/collection/")
	if collectionId == "" {
		http.Error(w, "ID da coleção não informado", http.StatusBadRequest)
		return
	}
	cards := GetCollectionCards(collectionId)
	json.NewEncoder(w).Encode(map[string][]Card{"cards": cards})
}

type Card struct {
	CardId   string
	CardName string
}

func GetCollectionCards(collectionId string) []Card {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Erro ao carregar variáveis de ambiente: %v", err)
	}

	spreadsheetId := os.Getenv("POKECHANCE_GOOGLE_SHEET_ID")
	googleSheets := google.NewGoogleSheets()
	sheetNames, err := googleSheets.GetSheetNames(spreadsheetId)
	if err != nil {
		log.Fatalf("Erro ao obter nomes das planilhas: %v", err)
	}

	if !slices.Contains(sheetNames, collectionId) {
		log.Fatalf("Coleção %s não encontrada", collectionId)
	}

	totalCardsInCollectionString, err := googleSheets.GetCellValue(spreadsheetId, collectionId, 53, "R")
	if err != nil {
		log.Fatalf("Erro ao obter o número total de cartas na coleção: %v", err)
	}

	totalCardsInCollection, err := strconv.Atoi(totalCardsInCollectionString)
	if err != nil {
		log.Fatalf("Erro ao converter o número total de cartas na coleção para int: %v", err)
	}

	values, err := googleSheets.GetRangeValues(spreadsheetId, collectionId, 2, "A", totalCardsInCollection+1, "C")
	if err != nil {
		log.Fatalf("Erro ao obter os valores da faixa: %v", err)
	}

	var cards []Card
	for _, row := range values {
		cards = append(cards, Card{
			CardId:   row[0],
			CardName: row[2],
		})
	}

	return cards
}

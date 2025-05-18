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
	mux.HandleFunc("/collection/", GetCollectionCardsfunc)
	return mux
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

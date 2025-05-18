package google

import (
	"context"
	"fmt"
	"os"
	"sync"

	"github.com/joho/godotenv"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/option"
	"google.golang.org/api/sheets/v4"
)

var instance *GoogleSheets
var once sync.Once

type GoogleSheets struct {
	sheetsService *sheets.Service
}

func NewGoogleSheets() *GoogleSheets {
	once.Do(func() {
		err := godotenv.Load()
		if err != nil {
			panic(fmt.Errorf("não foi possível carregar as variáveis de ambiente: %v", err))
		}

		credentialsPath := os.Getenv("POKECHANCE_GOOGLE_SHEET_CREDENTIALS_PATH")
		ctx := context.Background()

		credentials, err := os.ReadFile(credentialsPath)
		if err != nil {
			panic(fmt.Errorf("não foi possível ler o arquivo de credenciais: %v", err))
		}

		config, err := google.JWTConfigFromJSON(credentials, sheets.SpreadsheetsReadonlyScope)
		if err != nil {
			panic(fmt.Errorf("não foi possível analisar as credenciais: %v", err))
		}

		client := config.Client(ctx)
		sheetsService, err := sheets.NewService(ctx, option.WithHTTPClient(client))
		if err != nil {
			panic(fmt.Errorf("não foi possível criar o serviço do Sheets: %v", err))
		}

		instance = &GoogleSheets{
			sheetsService: sheetsService,
		}
	})
	return instance
}

func (gs *GoogleSheets) GetSheetNames(spreadsheetId string) ([]string, error) {
	spreadsheets, err := gs.sheetsService.Spreadsheets.Get(spreadsheetId).Do()
	if err != nil {
		return nil, fmt.Errorf("não foi possível obter informações da planilha: %v", err)
	}

	var sheetNames []string
	for _, sheet := range spreadsheets.Sheets {
		sheetNames = append(sheetNames, sheet.Properties.Title)
	}

	return sheetNames, nil
}

func (gs *GoogleSheets) GetCellValue(spreadsheetId string, sheetName string, row int, column string) (string, error) {
	v, err := gs.GetRangeValues(spreadsheetId, sheetName, row, column, row, column)
	if err != nil {
		return "", fmt.Errorf("não foi possível obter os valores da faixa: %v", err)
	}

	return v[0][0], nil
}

func (gs *GoogleSheets) GetRangeValues(spreadsheetId string, sheetName string, startRow int, startColumn string, endRow int, endColumn string) ([][]string, error) {
	cellRange := fmt.Sprintf("%s!%s%d:%s%d", sheetName, startColumn, startRow, endColumn, endRow)
	result, err := gs.sheetsService.Spreadsheets.Values.Get(spreadsheetId, cellRange).Do()
	if err != nil {
		return nil, fmt.Errorf("não foi possível obter os valores da faixa: %v", err)
	}

	if len(result.Values) == 0 {
		return nil, nil
	}

	values := make([][]string, len(result.Values))
	for i, row := range result.Values {
		values[i] = make([]string, len(row))
		for j, value := range row {
			values[i][j] = fmt.Sprint(value)
		}
	}
	return values, nil
}

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

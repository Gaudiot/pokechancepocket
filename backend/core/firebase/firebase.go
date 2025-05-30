package firebase

import (
	"context"
	"fmt"
	"sync"

	firebase_app "firebase.google.com/go/v4"
	"google.golang.org/api/option"
)

var (
	firebaseInstance *firebase_app.App
	firebaseOnce     sync.Once
)

func InitFirebase() error {
	var err error
	firebaseOnce.Do(func() {
		ctx := context.Background()

		// Carrega as credenciais da conta de serviço
		opt := option.WithCredentialsFile("/Users/victor.gaudiot/Desktop/projetos/pokechancepocket/backend/core/firebase/firebase_credentials.json")

		// Inicializa o app Firebase
		app, appErr := firebase_app.NewApp(ctx, nil, opt)
		if appErr != nil {
			err = fmt.Errorf("erro ao inicializar o app Firebase: %w", appErr)
			return
		}

		firebaseInstance = app
	})
	return err
}

func GetFirebaseService() (*firebase_app.App, error) {
	if firebaseInstance == nil {
		InitFirebase()
	}
	return firebaseInstance, nil
}

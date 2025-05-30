package firebase_auth

import (
	"context"
	"errors"
	"log"
	"net/http"
	"strings"

	"pokechancepocket/core/auth"
	"pokechancepocket/core/firebase"

	firebaseauth "firebase.google.com/go/v4/auth"
)

var (
	firebaseAuth *FirebaseAuth
)

type FirebaseAuth struct {
	auth *firebaseauth.Client
}

func initFirebaseAuth() (*FirebaseAuth, error) {
	firebaseApp, err := firebase.GetFirebaseService()
	if err != nil {
		return nil, err
	}

	ctx := context.Background()
	auth, err := firebaseApp.Auth(ctx)
	if err != nil {
		return nil, err
	}

	return &FirebaseAuth{auth: auth}, nil
}

func GetFirebaseAuth() *FirebaseAuth {
	if firebaseAuth == nil {
		firebaseAuthResult, err := initFirebaseAuth()
		if err != nil {
			log.Fatalf("Failed to initialize firebase auth: %v", err)
		}
		firebaseAuth = firebaseAuthResult
	}
	return firebaseAuth
}

func (f *FirebaseAuth) ValidateAndGetJWTData(r *http.Request) (*auth.TokenData, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return nil, errors.New("token não fornecido")
	}

	// Remove o prefixo "Bearer " se existir
	idToken := strings.TrimPrefix(authHeader, "Bearer ")

	ctx := context.Background()
	token, err := f.auth.VerifyIDToken(ctx, idToken)
	if err != nil {
		return nil, err
	}

	// Retorna os dados do token
	return &auth.TokenData{
		UID:    token.UID,
		Email:  token.Claims["email"].(string),
		Claims: token.Claims,
	}, nil
}

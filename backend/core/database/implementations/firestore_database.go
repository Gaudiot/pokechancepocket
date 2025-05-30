package database_firestore

import (
	"context"
	"pokechancepocket/core/firebase"

	"cloud.google.com/go/firestore"
)

var (
	firestoreDatabase *firestore.Client
)

func InitFirestoreDatabase() error {
	firebaseApp, err := firebase.GetFirebaseService()
	if err != nil {
		return err
	}

	ctx := context.Background()
	db, err := firebaseApp.Firestore(ctx)
	if err != nil {
		return err
	}

	firestoreDatabase = db
	return nil
}

func GetFirestoreDatabase() *firestore.Client {
	if firestoreDatabase == nil {
		InitFirestoreDatabase()
	}
	return firestoreDatabase
}

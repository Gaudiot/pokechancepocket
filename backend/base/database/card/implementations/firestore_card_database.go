package database_card_firestore

import (
	"context"
	card_database "pokechancepocket/base/database/card"
	database_firestore "pokechancepocket/core/database/implementations"

	"cloud.google.com/go/firestore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var (
	user_cards_collection_name = "user_cards"
)

type FirestoreCardDatabase struct {
	db *firestore.Client
}

func NewFirestoreCardDatabase() card_database.ICardDatabase {
	return &FirestoreCardDatabase{db: database_firestore.GetFirestoreDatabase()}
}

type FirestoreUserCards struct {
	Cards map[string][]int `firestore:"cards"`
}

func (f *FirestoreCardDatabase) GetUserCards(userID string) (*card_database.UserCards, error) {
	ctx := context.Background()

	doc, err := f.db.Collection(user_cards_collection_name).Doc(userID).Get(ctx)
	if err != nil {
		return nil, err
	}

	var firestoreUserCards FirestoreUserCards
	if err := doc.DataTo(&firestoreUserCards); err != nil {
		return nil, err
	}

	userCards := &card_database.UserCards{
		Cards: firestoreUserCards.Cards,
	}

	return userCards, nil
}

func (f *FirestoreCardDatabase) SetUserCards(userID string, collectionID string, cardsID []int) error {
	ctx := context.Background()

	doc := f.db.Collection(user_cards_collection_name).Doc(userID)

	userCards, err := f.GetUserCards(userID)
	if err != nil {
		st, ok := status.FromError(err)
		if ok && st.Code() == codes.NotFound {
			userCards = &card_database.UserCards{
				Cards: make(map[string][]int),
			}
		} else {
			return err
		}
	}

	userCards.Cards[collectionID] = cardsID

	firestoreUserCards := FirestoreUserCards{
		Cards: userCards.Cards,
	}

	_, err = doc.Set(ctx, firestoreUserCards)
	return err
}

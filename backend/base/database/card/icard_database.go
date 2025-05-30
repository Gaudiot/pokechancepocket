package card_database

type UserCards struct {
	Cards map[string][]int
}

type ICardDatabase interface {
	GetUserCards(userID string) (*UserCards, error)
	SetUserCards(userID string, collectionID string, cardsID []int) error
}

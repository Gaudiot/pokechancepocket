package auth

import "net/http"

type TokenData struct {
	UID    string
	Email  string
	Claims map[string]interface{}
}

type IAuth interface {
	ValidateAndGetJWTData(r *http.Request) (*TokenData, error)
}

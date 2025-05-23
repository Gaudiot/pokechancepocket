package main

import (
	"fmt"
	"net/http"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
		return
	}

	fmt.Println("Server is running on port 8080")
	http.ListenAndServe(":8080", RouteHandler())
}

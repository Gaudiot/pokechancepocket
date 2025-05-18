package main

import (
	"net/http"
	collections_router "pokechancepocket/src/collections"
)

func RouteHandler() *http.ServeMux {
	mux := http.NewServeMux()
	mux.Handle("/collection/", collections_router.CollectionsRouteHandler())
	return mux
}

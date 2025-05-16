package network

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"pokechancepocket/core/network"
)

type HttpNetwork struct {
}

func formatUrlWithQueryParams(url string, queryParams map[string]string) string {
	queryParamsString := ""
	for key, value := range queryParams {
		if len(queryParamsString) > 0 {
			queryParamsString += "&"
		}

		queryParamsString += key + "=" + value
	}

	if len(queryParamsString) == 0 {
		return url
	}

	return url + "?" + queryParamsString
}

func (n *HttpNetwork) Get(params network.GetParams) ([]byte, error) {
	formattedUrl := formatUrlWithQueryParams(params.URL, params.QueryParameters)
	resp, err := http.Get(formattedUrl)
	if err != nil {
		return nil, err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	return body, nil
}

func (n *HttpNetwork) Post(params network.PostParams) ([]byte, error) {
	formattedUrl := formatUrlWithQueryParams(params.URL, params.QueryParameters)
	postBody, _ := json.Marshal(params.Body)
	resp, err := http.Post(formattedUrl, "application/json", bytes.NewBuffer(postBody))
	if err != nil {
		return nil, err
	}

	body, err := io.ReadAll(resp.Body)
	defer resp.Body.Close()
	if err != nil {
		return nil, err
	}

	return body, nil
}

func (n *HttpNetwork) Put(params network.PutParams) ([]byte, error) {
	formattedUrl := formatUrlWithQueryParams(params.URL, params.QueryParameters)
	putBody, _ := json.Marshal(params.Body)
	resp, err := http.NewRequest(http.MethodPut, formattedUrl, bytes.NewBuffer(putBody))
	if err != nil {
		return nil, err
	}
	resp.Header.Set("Content-Type", "application/json")

	body, err := io.ReadAll(resp.Body)
	defer resp.Body.Close()
	if err != nil {
		return nil, err
	}

	return body, nil
}

func (n *HttpNetwork) Delete(params network.DeleteParams) ([]byte, error) {
	formattedUrl := formatUrlWithQueryParams(params.URL, params.QueryParameters)
	resp, err := http.NewRequest(http.MethodDelete, formattedUrl, nil)
	if err != nil {
		return nil, err
	}

	body, err := io.ReadAll(resp.Body)
	defer resp.Body.Close()
	if err != nil {
		return nil, err
	}

	return body, nil
}

func (n *HttpNetwork) Patch(params network.PatchParams) ([]byte, error) {
	formattedUrl := formatUrlWithQueryParams(params.URL, params.QueryParameters)
	patchBody, _ := json.Marshal(params.Body)
	resp, err := http.NewRequest(http.MethodPatch, formattedUrl, bytes.NewBuffer(patchBody))
	if err != nil {
		return nil, err
	}

	body, err := io.ReadAll(resp.Body)
	defer resp.Body.Close()
	if err != nil {
		return nil, err
	}

	return body, nil
}

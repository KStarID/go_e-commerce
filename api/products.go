package handler

import (
	"encoding/json"
	"net/http"
)

type Product struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	ImageURL    string  `json:"image_url"`
	Stock       int     `json:"stock"`
	Category    string  `json:"category"`
}

func ProductsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	
	client := GetSupabaseClient()
	
	var products []Product
	err := client.DB.From("products").Select("*").Execute(&products)
	
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Failed to fetch products",
		})
		return
	}
	
	json.NewEncoder(w).Encode(products)
}

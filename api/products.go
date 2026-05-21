package handler

import (
	"encoding/json"
	"net/http"
	"os"
	supa "github.com/supabase-community/supabase-go"
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
	
	supabaseURL := os.Getenv("NEXT_PUBLIC_SUPABASE_URL")
	supabaseKey := os.Getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
	
	client, err := supa.NewClient(supabaseURL, supabaseKey, &supa.ClientOptions{})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Failed to connect to database",
		})
		return
	}
	
	data, _, err := client.From("products").Select("*", "", false).Execute()
	
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Failed to fetch products",
		})
		return
	}

	var products []Product
	if err := json.Unmarshal(data, &products); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Failed to parse data",
		})
		return
	}
	
	json.NewEncoder(w).Encode(products)
}

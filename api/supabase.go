package handler

import (
	"os"
	supa "github.com/supabase-community/supabase-go"
)

var supabaseClient *supa.Client

func GetSupabaseClient() *supa.Client {
	if supabaseClient != nil {
		return supabaseClient
	}

	supabaseURL := os.Getenv("NEXT_PUBLIC_SUPABASE_URL")
	supabaseKey := os.Getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

	client, err := supa.NewClient(supabaseURL, supabaseKey, &supa.ClientOptions{})
	if err != nil {
		panic(err)
	}

	supabaseClient = client
	return supabaseClient
}

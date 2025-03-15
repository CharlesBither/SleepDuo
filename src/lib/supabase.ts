import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://cqulufkjijjlvyuqwudk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxdWx1ZmtqaWpqbHZ5dXF3dWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5OTk4NjEsImV4cCI6MjA1NzU3NTg2MX0.ijwizdD9j3KWDnriCOfv5Pltrf4la_rf3iYSDi8GuEQ"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
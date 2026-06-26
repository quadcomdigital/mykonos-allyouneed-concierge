export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      apartments: {
        Row: {
          amenities: string[] | null
          bathrooms: number
          bedrooms: number
          capacity: number
          created_at: string
          description: string | null
          featured_image: string | null
          guest_options: number[] | null
          has_kitchen: boolean | null
          highlights: string[] | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean
          name: string
          pool_type: string | null
          price_range: string | null
          slug: string
          tagline: string | null
          updated_at: string
          zone: string
        }
        Insert: {
          amenities?: string[] | null
          bathrooms?: number
          bedrooms?: number
          capacity?: number
          created_at?: string
          description?: string | null
          featured_image?: string | null
          guest_options?: number[] | null
          has_kitchen?: boolean | null
          highlights?: string[] | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean
          name: string
          pool_type?: string | null
          price_range?: string | null
          slug: string
          tagline?: string | null
          updated_at?: string
          zone: string
        }
        Update: {
          amenities?: string[] | null
          bathrooms?: number
          bedrooms?: number
          capacity?: number
          created_at?: string
          description?: string | null
          featured_image?: string | null
          guest_options?: number[] | null
          has_kitchen?: boolean | null
          highlights?: string[] | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean
          name?: string
          pool_type?: string | null
          price_range?: string | null
          slug?: string
          tagline?: string | null
          updated_at?: string
          zone?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          forward_status: string | null
          forward_to: string | null
          guests: number | null
          id: string
          message: string | null
          notes: string | null
          service_name: string | null
          service_type: string
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          forward_status?: string | null
          forward_to?: string | null
          guests?: number | null
          id?: string
          message?: string | null
          notes?: string | null
          service_name?: string | null
          service_type: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          forward_status?: string | null
          forward_to?: string | null
          guests?: number | null
          id?: string
          message?: string | null
          notes?: string | null
          service_name?: string | null
          service_type?: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_bookings: {
        Row: {
          booker: string | null
          booking_time: string | null
          booking_type: string
          created_at: string
          email: string
          event_date: string
          event_dj: string
          event_id: string | null
          full_name: string
          gender: string | null
          guests: number
          id: string
          notes: string | null
          pax: number | null
          phone: string
          spend: string | null
          status: string
          ticket_code: string | null
          updated_at: string
          venue_name: string
          venue_slug: string | null
        }
        Insert: {
          booker?: string | null
          booking_time?: string | null
          booking_type?: string
          created_at?: string
          email: string
          event_date: string
          event_dj: string
          event_id?: string | null
          full_name: string
          gender?: string | null
          guests?: number
          id?: string
          notes?: string | null
          pax?: number | null
          phone: string
          spend?: string | null
          status?: string
          ticket_code?: string | null
          updated_at?: string
          venue_name: string
          venue_slug?: string | null
        }
        Update: {
          booker?: string | null
          booking_time?: string | null
          booking_type?: string
          created_at?: string
          email?: string
          event_date?: string
          event_dj?: string
          event_id?: string | null
          full_name?: string
          gender?: string | null
          guests?: number
          id?: string
          notes?: string | null
          pax?: number | null
          phone?: string
          spend?: string | null
          status?: string
          ticket_code?: string | null
          updated_at?: string
          venue_name?: string
          venue_slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_table_bookings: {
        Row: {
          created_at: string
          event_booking_id: string | null
          event_id: string
          id: string
          price_override: number | null
          status: string
          updated_at: string
          venue_table_id: string
        }
        Insert: {
          created_at?: string
          event_booking_id?: string | null
          event_id: string
          id?: string
          price_override?: number | null
          status?: string
          updated_at?: string
          venue_table_id: string
        }
        Update: {
          created_at?: string
          event_booking_id?: string | null
          event_id?: string
          id?: string
          price_override?: number | null
          status?: string
          updated_at?: string
          venue_table_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          accredito_deadline: string | null
          booking_mode: string
          created_at: string
          date: string
          description: string | null
          dj: string
          dj_bio: string | null
          gallery_images: string[] | null
          hero_video_url: string | null
          highlight: boolean | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_sold_out: boolean | null
          price_from: number | null
          scarcity_label: string | null
          slug: string | null
          sort_order: number | null
          sort_priority: number | null
          spotify_embed_url: string | null
          tag: string | null
          testimonials: Json | null
          time: string | null
          updated_at: string
          venue_id: string | null
          venue_name: string | null
          venue_slug: string | null
        }
        Insert: {
          accredito_deadline?: string | null
          booking_mode?: string
          created_at?: string
          date: string
          description?: string | null
          dj: string
          dj_bio?: string | null
          gallery_images?: string[] | null
          hero_video_url?: string | null
          highlight?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_sold_out?: boolean | null
          price_from?: number | null
          scarcity_label?: string | null
          slug?: string | null
          sort_order?: number | null
          sort_priority?: number | null
          spotify_embed_url?: string | null
          tag?: string | null
          testimonials?: Json | null
          time?: string | null
          updated_at?: string
          venue_id?: string | null
          venue_name?: string | null
          venue_slug?: string | null
        }
        Update: {
          accredito_deadline?: string | null
          booking_mode?: string
          created_at?: string
          date?: string
          description?: string | null
          dj?: string
          dj_bio?: string | null
          gallery_images?: string[] | null
          hero_video_url?: string | null
          highlight?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_sold_out?: boolean | null
          price_from?: number | null
          scarcity_label?: string | null
          slug?: string | null
          sort_order?: number | null
          sort_priority?: number | null
          spotify_embed_url?: string | null
          tag?: string | null
          testimonials?: Json | null
          time?: string | null
          updated_at?: string
          venue_id?: string | null
          venue_name?: string | null
          venue_slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          category: string
          created_at: string
          featured_image: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean
          name: string
          price_high: string | null
          price_low: string | null
          price_mid: string | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          featured_image?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean
          name: string
          price_high?: string | null
          price_low?: string | null
          price_mid?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          featured_image?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean
          name?: string
          price_high?: string | null
          price_low?: string | null
          price_mid?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      venue_tables: {
        Row: {
          capacity: number
          created_at: string
          default_price: number
          id: string
          pos_h: number
          pos_w: number
          pos_x: number
          pos_y: number
          section: string
          shape: string
          sort_order: number
          table_number: string
          updated_at: string
          venue_slug: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          default_price?: number
          id?: string
          pos_h?: number
          pos_w?: number
          pos_x?: number
          pos_y?: number
          section?: string
          shape?: string
          sort_order?: number
          table_number: string
          updated_at?: string
          venue_slug: string
        }
        Update: {
          capacity?: number
          created_at?: string
          default_price?: number
          id?: string
          pos_h?: number
          pos_w?: number
          pos_x?: number
          pos_y?: number
          section?: string
          shape?: string
          sort_order?: number
          table_number?: string
          updated_at?: string
          venue_slug?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          booking_mode: string | null
          category: string
          created_at: string
          cuisine: string | null
          description: string | null
          dress_code: string | null
          email: string | null
          featured_image: string | null
          gallery: string[] | null
          has_table_map: boolean | null
          highlights: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean
          long_description: string | null
          music_style: string | null
          name: string
          opening_hours: string | null
          season: string | null
          slug: string
          sort_order: number | null
          table_map_image_url: string | null
          updated_at: string
          vibe: string[] | null
          whatsapp: string | null
          zone: string | null
        }
        Insert: {
          booking_mode?: string | null
          category: string
          created_at?: string
          cuisine?: string | null
          description?: string | null
          dress_code?: string | null
          email?: string | null
          featured_image?: string | null
          gallery?: string[] | null
          has_table_map?: boolean | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean
          long_description?: string | null
          music_style?: string | null
          name: string
          opening_hours?: string | null
          season?: string | null
          slug: string
          sort_order?: number | null
          table_map_image_url?: string | null
          updated_at?: string
          vibe?: string[] | null
          whatsapp?: string | null
          zone?: string | null
        }
        Update: {
          booking_mode?: string | null
          category?: string
          created_at?: string
          cuisine?: string | null
          description?: string | null
          dress_code?: string | null
          email?: string | null
          featured_image?: string | null
          gallery?: string[] | null
          has_table_map?: boolean | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean
          long_description?: string | null
          music_style?: string | null
          name?: string
          opening_hours?: string | null
          season?: string | null
          slug?: string
          sort_order?: number | null
          table_map_image_url?: string | null
          updated_at?: string
          vibe?: string[] | null
          whatsapp?: string | null
          zone?: string | null
        }
        Relationships: []
      }
      villas: {
        Row: {
          amenities: string[] | null
          bathrooms: number
          bedrooms: number
          capacity: number
          created_at: string
          description: string | null
          distances: Json | null
          featured_image: string | null
          highlights: string[] | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean
          name: string
          price_range: string | null
          slug: string
          tagline: string | null
          updated_at: string
          zone: string
        }
        Insert: {
          amenities?: string[] | null
          bathrooms?: number
          bedrooms?: number
          capacity?: number
          created_at?: string
          description?: string | null
          distances?: Json | null
          featured_image?: string | null
          highlights?: string[] | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean
          name: string
          price_range?: string | null
          slug: string
          tagline?: string | null
          updated_at?: string
          zone: string
        }
        Update: {
          amenities?: string[] | null
          bathrooms?: number
          bedrooms?: number
          capacity?: number
          created_at?: string
          description?: string | null
          distances?: Json | null
          featured_image?: string | null
          highlights?: string[] | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean
          name?: string
          price_range?: string | null
          slug?: string
          tagline?: string | null
          updated_at?: string
          zone?: string
        }
        Relationships: []
      }
      yachts: {
        Row: {
          cabins: number | null
          created_at: string
          crew: number | null
          description_en: string | null
          description_it: string | null
          engines: string | null
          featured_image: string | null
          guests: number | null
          id: string
          images: string[] | null
          includes: string[] | null
          is_active: boolean | null
          is_featured: boolean
          length: string | null
          model: string | null
          name: string
          overnight_guests: number | null
          slug: string
          sort_order: number | null
          speed: string | null
          updated_at: string
          year: string | null
        }
        Insert: {
          cabins?: number | null
          created_at?: string
          crew?: number | null
          description_en?: string | null
          description_it?: string | null
          engines?: string | null
          featured_image?: string | null
          guests?: number | null
          id?: string
          images?: string[] | null
          includes?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean
          length?: string | null
          model?: string | null
          name: string
          overnight_guests?: number | null
          slug: string
          sort_order?: number | null
          speed?: string | null
          updated_at?: string
          year?: string | null
        }
        Update: {
          cabins?: number | null
          created_at?: string
          crew?: number | null
          description_en?: string | null
          description_it?: string | null
          engines?: string | null
          featured_image?: string | null
          guests?: number | null
          id?: string
          images?: string[] | null
          includes?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean
          length?: string | null
          model?: string | null
          name?: string
          overnight_guests?: number | null
          slug?: string
          sort_order?: number | null
          speed?: string | null
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const

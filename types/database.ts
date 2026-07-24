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
      albums: {
        Row: {
          artist_id: string | null
          cover_art_url: string | null
          created_at: string
          id: string
          release_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          artist_id?: string | null
          cover_art_url?: string | null
          created_at?: string
          id?: string
          release_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          artist_id?: string | null
          cover_art_url?: string | null
          created_at?: string
          id?: string
          release_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "albums_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          artist_name: string
          calendly_url: string | null
          consent: boolean | null
          created_at: string | null
          element: Database["public"]["Enums"]["element_type"]
          email: string
          genre: string | null
          id: string
          phone: string | null
          portfolio_urls: string[]
          retains_ip: string | null
          reviewed_at: string | null
          services_needed: string[]
          stage: Database["public"]["Enums"]["application_stage"] | null
          status: Database["public"]["Enums"]["application_status"] | null
          user_id: string | null
          what_they_build: string | null
          why_studios: string | null
        }
        Insert: {
          artist_name: string
          calendly_url?: string | null
          consent?: boolean | null
          created_at?: string | null
          element?: Database["public"]["Enums"]["element_type"]
          email: string
          genre?: string | null
          id?: string
          phone?: string | null
          portfolio_urls?: string[]
          retains_ip?: string | null
          reviewed_at?: string | null
          services_needed?: string[]
          stage?: Database["public"]["Enums"]["application_stage"] | null
          status?: Database["public"]["Enums"]["application_status"] | null
          user_id?: string | null
          what_they_build?: string | null
          why_studios?: string | null
        }
        Update: {
          artist_name?: string
          calendly_url?: string | null
          consent?: boolean | null
          created_at?: string | null
          element?: Database["public"]["Enums"]["element_type"]
          email?: string
          genre?: string | null
          id?: string
          phone?: string | null
          portfolio_urls?: string[]
          retains_ip?: string | null
          reviewed_at?: string | null
          services_needed?: string[]
          stage?: Database["public"]["Enums"]["application_stage"] | null
          status?: Database["public"]["Enums"]["application_status"] | null
          user_id?: string | null
          what_they_build?: string | null
          why_studios?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string | null
          created_at: string
          description: string | null
          digital_price_cents: number | null
          featured: boolean
          id: string
          image_url: string | null
          physical_price_cents: number | null
          slug: string
          status: string
          title: string
          volume_number: number | null
        }
        Insert: {
          author?: string | null
          created_at?: string
          description?: string | null
          digital_price_cents?: number | null
          featured?: boolean
          id?: string
          image_url?: string | null
          physical_price_cents?: number | null
          slug: string
          status?: string
          title: string
          volume_number?: number | null
        }
        Update: {
          author?: string | null
          created_at?: string
          description?: string | null
          digital_price_cents?: number | null
          featured?: boolean
          id?: string
          image_url?: string | null
          physical_price_cents?: number | null
          slug?: string
          status?: string
          title?: string
          volume_number?: number | null
        }
        Relationships: []
      }
      content_publications: {
        Row: {
          author_wallet: string | null
          body: string
          content_type: string
          created_at: string
          excerpt: string | null
          id: string
          pillar: string | null
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_wallet?: string | null
          body: string
          content_type?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          pillar?: string | null
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_wallet?: string | null
          body?: string
          content_type?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          pillar?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      deployment_logs: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          status: string
          triggered_by: string | null
          type: string
          vercel_deployment_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          triggered_by?: string | null
          type?: string
          vercel_deployment_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          triggered_by?: string | null
          type?: string
          vercel_deployment_id?: string | null
        }
        Relationships: []
      }
      dimension_scores: {
        Row: {
          created_at: string
          dimension: string
          id: string
          metadata: Json
          os_layer: string
          score: number
          source: string
        }
        Insert: {
          created_at?: string
          dimension: string
          id?: string
          metadata?: Json
          os_layer: string
          score: number
          source?: string
        }
        Update: {
          created_at?: string
          dimension?: string
          id?: string
          metadata?: Json
          os_layer?: string
          score?: number
          source?: string
        }
        Relationships: []
      }
      dodecanic_readings: {
        Row: {
          archetype: string
          bound_at: string
          chain_id: number
          claim_hash: string
          element: string
          house: number
          id: string
          message: string
          pillar: string
          signature: string
          updated_at: string
          wallet_address: string
        }
        Insert: {
          archetype: string
          bound_at?: string
          chain_id: number
          claim_hash: string
          element: string
          house: number
          id?: string
          message: string
          pillar: string
          signature: string
          updated_at?: string
          wallet_address: string
        }
        Update: {
          archetype?: string
          bound_at?: string
          chain_id?: number
          claim_hash?: string
          element?: string
          house?: number
          id?: string
          message?: string
          pillar?: string
          signature?: string
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          event_date: string
          id: string
          image_url: string | null
          location: string | null
          location_address: string | null
          location_type: string | null
          members_only: boolean
          parent_event_id: string | null
          pillar: string
          price_cents: number | null
          published_at: string | null
          recurring: string | null
          recurring_until: string | null
          requires_approval: boolean
          slug: string
          status: string
          stripe_price_id: string | null
          stripe_product_id: string | null
          title: string
          type: string
          updated_at: string
          virtual_url: string | null
          waitlist_enabled: boolean
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          location?: string | null
          location_address?: string | null
          location_type?: string | null
          members_only?: boolean
          parent_event_id?: string | null
          pillar: string
          price_cents?: number | null
          published_at?: string | null
          recurring?: string | null
          recurring_until?: string | null
          requires_approval?: boolean
          slug: string
          status?: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          title: string
          type: string
          updated_at?: string
          virtual_url?: string | null
          waitlist_enabled?: boolean
        }
        Update: {
          capacity?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          location?: string | null
          location_address?: string | null
          location_type?: string | null
          members_only?: boolean
          parent_event_id?: string | null
          pillar?: string
          price_cents?: number | null
          published_at?: string | null
          recurring?: string | null
          recurring_until?: string | null
          requires_approval?: boolean
          slug?: string
          status?: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          title?: string
          type?: string
          updated_at?: string
          virtual_url?: string | null
          waitlist_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "events_parent_event_id_fkey"
            columns: ["parent_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_memberships: {
        Row: {
          amount_cents: number
          cancel_at_period_end: boolean
          canceled_at: string | null
          created_at: string
          currency: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          last_stripe_event_created: number | null
          last_stripe_event_id: string | null
          metadata: Json
          started_at: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: string
          updated_at: string
          wallet_address: string
        }
        Insert: {
          amount_cents?: number
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          last_stripe_event_created?: number | null
          last_stripe_event_id?: string | null
          metadata?: Json
          started_at?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string
          wallet_address: string
        }
        Update: {
          amount_cents?: number
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          last_stripe_event_created?: number | null
          last_stripe_event_id?: string | null
          metadata?: Json
          started_at?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          additional_files: string[]
          admin_notes: string | null
          cover_letter: string | null
          created_at: string
          element: string | null
          email: string
          full_name: string
          has_reading: boolean
          house_number: number | null
          id: string
          interview_stage: string | null
          job_id: string
          linkedin_url: string | null
          location: string | null
          phone: string | null
          pillar: string | null
          portfolio_url: string | null
          referred_by: string | null
          resume_url: string | null
          status: string
          updated_at: string
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          additional_files?: string[]
          admin_notes?: string | null
          cover_letter?: string | null
          created_at?: string
          element?: string | null
          email: string
          full_name: string
          has_reading?: boolean
          house_number?: number | null
          id?: string
          interview_stage?: string | null
          job_id: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          pillar?: string | null
          portfolio_url?: string | null
          referred_by?: string | null
          resume_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          additional_files?: string[]
          admin_notes?: string | null
          cover_letter?: string | null
          created_at?: string
          element?: string | null
          email?: string
          full_name?: string
          has_reading?: boolean
          house_number?: number | null
          id?: string
          interview_stage?: string | null
          job_id?: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          pillar?: string | null
          portfolio_url?: string | null
          referred_by?: string | null
          resume_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          benefits: string[]
          closing_date: string | null
          compensation: string | null
          created_at: string
          department: string | null
          description: string
          id: string
          location: string | null
          nice_to_have: string[]
          pillar: string | null
          posted_date: string | null
          remote: boolean
          requirements: string[]
          responsibilities: string[]
          slug: string
          status: string
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          benefits?: string[]
          closing_date?: string | null
          compensation?: string | null
          created_at?: string
          department?: string | null
          description: string
          id?: string
          location?: string | null
          nice_to_have?: string[]
          pillar?: string | null
          posted_date?: string | null
          remote?: boolean
          requirements?: string[]
          responsibilities?: string[]
          slug: string
          status?: string
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          benefits?: string[]
          closing_date?: string | null
          compensation?: string | null
          created_at?: string
          department?: string | null
          description?: string
          id?: string
          location?: string | null
          nice_to_have?: string[]
          pillar?: string | null
          posted_date?: string | null
          remote?: boolean
          requirements?: string[]
          responsibilities?: string[]
          slug?: string
          status?: string
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      people: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          element: string | null
          email: string | null
          house: number | null
          id: string
          name: string
          phone: string | null
          pillar: string | null
          role: string
          social_links: Json
          status: string
          updated_at: string
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          element?: string | null
          email?: string | null
          house?: number | null
          id?: string
          name: string
          phone?: string | null
          pillar?: string | null
          role?: string
          social_links?: Json
          status?: string
          updated_at?: string
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          element?: string | null
          email?: string | null
          house?: number | null
          id?: string
          name?: string
          phone?: string | null
          pillar?: string | null
          role?: string
          social_links?: Json
          status?: string
          updated_at?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      pillar_activities: {
        Row: {
          created_at: string
          cta_label: string
          ends_at: string | null
          href: string
          id: string
          kicker: string
          kind: string
          pillar: string
          priority: number
          published_at: string | null
          slug: string
          starts_at: string | null
          status: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_label: string
          ends_at?: string | null
          href: string
          id?: string
          kicker: string
          kind: string
          pillar: string
          priority?: number
          published_at?: string | null
          slug: string
          starts_at?: string | null
          status?: string
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_label?: string
          ends_at?: string | null
          href?: string
          id?: string
          kicker?: string
          kind?: string
          pillar?: string
          priority?: number
          published_at?: string | null
          slug?: string
          starts_at?: string | null
          status?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          featured: boolean
          fulfillment_type: string
          id: string
          image_url: string | null
          metadata: Json
          pillar: string
          price_cents: number | null
          slug: string | null
          status: string
          stripe_price_id: string | null
          stripe_product_id: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          featured?: boolean
          fulfillment_type?: string
          id?: string
          image_url?: string | null
          metadata?: Json
          pillar: string
          price_cents?: number | null
          slug?: string | null
          status?: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          featured?: boolean
          fulfillment_type?: string
          id?: string
          image_url?: string | null
          metadata?: Json
          pillar?: string
          price_cents?: number | null
          slug?: string | null
          status?: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          artist_id: string | null
          asset_url: string | null
          created_at: string | null
          element: Database["public"]["Enums"]["element_type"]
          id: string
          release_date: string | null
          revenue_total: number | null
          status: Database["public"]["Enums"]["project_status"] | null
          sync_eligible: boolean | null
          title: string
          type: Database["public"]["Enums"]["project_type"] | null
          updated_at: string | null
        }
        Insert: {
          artist_id?: string | null
          asset_url?: string | null
          created_at?: string | null
          element?: Database["public"]["Enums"]["element_type"]
          id?: string
          release_date?: string | null
          revenue_total?: number | null
          status?: Database["public"]["Enums"]["project_status"] | null
          sync_eligible?: boolean | null
          title: string
          type?: Database["public"]["Enums"]["project_type"] | null
          updated_at?: string | null
        }
        Update: {
          artist_id?: string | null
          asset_url?: string | null
          created_at?: string | null
          element?: Database["public"]["Enums"]["element_type"]
          id?: string
          release_date?: string | null
          revenue_total?: number | null
          status?: Database["public"]["Enums"]["project_status"] | null
          sync_eligible?: boolean | null
          title?: string
          type?: Database["public"]["Enums"]["project_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          created_at: string
          customer_email: string | null
          fulfillment_status: string
          id: string
          metadata: Json
          passport_id: string | null
          product_id: string | null
          product_type: string
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          fulfillment_status?: string
          id?: string
          metadata?: Json
          passport_id?: string | null
          product_id?: string | null
          product_type: string
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          fulfillment_status?: string
          id?: string
          metadata?: Json
          passport_id?: string | null
          product_id?: string | null
          product_type?: string
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      readings: {
        Row: {
          birth_date: string
          birth_place: string
          birth_time: string | null
          chart_json: Json
          confidence: number
          created_at: string
          dominant_body: string
          dominant_pillar: string
          engine_version: string
          has_birth_time: boolean
          id: string
          is_guardian: boolean
          reading_json: Json
          secondary_pillar: string | null
          user_id: string | null
        }
        Insert: {
          birth_date: string
          birth_place: string
          birth_time?: string | null
          chart_json: Json
          confidence: number
          created_at?: string
          dominant_body: string
          dominant_pillar: string
          engine_version?: string
          has_birth_time?: boolean
          id?: string
          is_guardian?: boolean
          reading_json: Json
          secondary_pillar?: string | null
          user_id?: string | null
        }
        Update: {
          birth_date?: string
          birth_place?: string
          birth_time?: string | null
          chart_json?: Json
          confidence?: number
          created_at?: string
          dominant_body?: string
          dominant_pillar?: string
          engine_version?: string
          has_birth_time?: boolean
          id?: string
          is_guardian?: boolean
          reading_json?: Json
          secondary_pillar?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      revenue_entries: {
        Row: {
          amount: number
          artist_share: number | null
          created_at: string | null
          element: Database["public"]["Enums"]["element_type"]
          founder_share: number | null
          guild_share: number | null
          id: string
          infra_share: number | null
          project_id: string | null
          source: Database["public"]["Enums"]["revenue_source"] | null
          stipend_share: number | null
        }
        Insert: {
          amount: number
          artist_share?: number | null
          created_at?: string | null
          element?: Database["public"]["Enums"]["element_type"]
          founder_share?: number | null
          guild_share?: number | null
          id?: string
          infra_share?: number | null
          project_id?: string | null
          source?: Database["public"]["Enums"]["revenue_source"] | null
          stipend_share?: number | null
        }
        Update: {
          amount?: number
          artist_share?: number | null
          created_at?: string | null
          element?: Database["public"]["Enums"]["element_type"]
          founder_share?: number | null
          guild_share?: number | null
          id?: string
          infra_share?: number | null
          project_id?: string | null
          source?: Database["public"]["Enums"]["revenue_source"] | null
          stipend_share?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "revenue_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      royalty_splits: {
        Row: {
          album_id: string | null
          created_at: string
          id: string
          percentage: number
          person_id: string
          track_id: string | null
        }
        Insert: {
          album_id?: string | null
          created_at?: string
          id?: string
          percentage: number
          person_id: string
          track_id?: string | null
        }
        Update: {
          album_id?: string | null
          created_at?: string
          id?: string
          percentage?: number
          person_id?: string
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "royalty_splits_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "royalty_splits_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "royalty_splits_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      rsvps: {
        Row: {
          amount_paid_cents: number
          created_at: string
          email: string | null
          event_id: string
          first_time: boolean
          id: string
          is_member: boolean
          name: string | null
          phone: string | null
          reservation_expires_at: string | null
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_paid_cents?: number
          created_at?: string
          email?: string | null
          event_id: string
          first_time?: boolean
          id?: string
          is_member?: boolean
          name?: string | null
          phone?: string | null
          reservation_expires_at?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_paid_cents?: number
          created_at?: string
          email?: string | null
          event_id?: string
          first_time?: boolean
          id?: string
          is_member?: boolean
          name?: string | null
          phone?: string | null
          reservation_expires_at?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_webhook_events: {
        Row: {
          event_id: string
          event_type: string
          object_id: string | null
          payload: Json
          processed_at: string
        }
        Insert: {
          event_id: string
          event_type: string
          object_id?: string | null
          payload?: Json
          processed_at?: string
        }
        Update: {
          event_id?: string
          event_type?: string
          object_id?: string | null
          payload?: Json
          processed_at?: string
        }
        Relationships: []
      }
      telemetry_snapshots: {
        Row: {
          active_edges: number
          active_houses: number
          active_members: number
          created_at: string
          dimensions: Json
          id: string
          observer_seat: string
          overall_coherence: number
          snapshot_time: string
          total_edges: number
          total_houses: number
        }
        Insert: {
          active_edges?: number
          active_houses?: number
          active_members?: number
          created_at?: string
          dimensions: Json
          id?: string
          observer_seat?: string
          overall_coherence: number
          snapshot_time?: string
          total_edges?: number
          total_houses?: number
        }
        Update: {
          active_edges?: number
          active_houses?: number
          active_members?: number
          created_at?: string
          dimensions?: Json
          id?: string
          observer_seat?: string
          overall_coherence?: number
          snapshot_time?: string
          total_edges?: number
          total_houses?: number
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_name: string
          avatar_url: string | null
          created_at: string
          display_order: number
          featured: boolean
          house_number: number | null
          id: string
          joined_date: string | null
          pillar: string
          quote: string
          role: string | null
          status: string
        }
        Insert: {
          author_name: string
          avatar_url?: string | null
          created_at?: string
          display_order?: number
          featured?: boolean
          house_number?: number | null
          id?: string
          joined_date?: string | null
          pillar: string
          quote: string
          role?: string | null
          status?: string
        }
        Update: {
          author_name?: string
          avatar_url?: string | null
          created_at?: string
          display_order?: number
          featured?: boolean
          house_number?: number | null
          id?: string
          joined_date?: string | null
          pillar?: string
          quote?: string
          role?: string | null
          status?: string
        }
        Relationships: []
      }
      tracks: {
        Row: {
          album_id: string | null
          artist_id: string | null
          audio_url: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          isrc: string | null
          release_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          album_id?: string | null
          artist_id?: string | null
          audio_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          isrc?: string | null
          release_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          album_id?: string | null
          artist_id?: string | null
          audio_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          isrc?: string | null
          release_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracks_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracks_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          description: string | null
          id: string
          last_stripe_event_created: number | null
          last_stripe_event_id: string | null
          metadata: Json
          person_id: string | null
          status: string
          stripe_ref: string | null
          type: string
          updated_at: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          last_stripe_event_created?: number | null
          last_stripe_event_id?: string | null
          metadata?: Json
          person_id?: string | null
          status?: string
          stripe_ref?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          last_stripe_event_created?: number | null
          last_stripe_event_id?: string | null
          metadata?: Json
          person_id?: string | null
          status?: string
          stripe_ref?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          elements: Database["public"]["Enums"]["element_type"][] | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          password_hash: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          elements?: Database["public"]["Enums"]["element_type"][] | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          password_hash: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          elements?: Database["public"]["Enums"]["element_type"][] | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          password_hash?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          duration_seconds: number | null
          id: string
          pillar: string | null
          published_at: string | null
          status: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          pillar?: string | null
          published_at?: string | null
          status?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          pillar?: string | null
          published_at?: string | null
          status?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          created_at: string
          id: string
          preferred_dates: string[] | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          preferred_dates?: string[] | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          preferred_dates?: string[] | null
          status?: string
        }
        Relationships: []
      }
      wallet_nonces: {
        Row: {
          created_at: string
          expires_at: string
          nonce: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          nonce: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          nonce?: string
          used_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bind_dodecanic_reading: {
        Args: {
          p_archetype: string
          p_bound_at: string
          p_chain_id: number
          p_claim_hash: string
          p_element: string
          p_house: number
          p_message: string
          p_nonce: string
          p_pillar: string
          p_signature: string
          p_wallet_address: string
        }
        Returns: boolean
      }
      homepage_activity: {
        Args: { limit_count?: number }
        Returns: {
          action: string
          icon: string
          occurred_at: string
          pillar: string
        }[]
      }
      homepage_guardian_audit_count: { Args: never; Returns: number }
      homepage_rsvp_count: { Args: { target_event: string }; Returns: number }
      reserve_event_rsvp: {
        Args: {
          p_email: string
          p_event_id: string
          p_first_time?: boolean
          p_is_member?: boolean
          p_name: string
          p_phone?: string
        }
        Returns: {
          amount_paid_cents: number
          created_at: string
          email: string | null
          event_id: string
          first_time: boolean
          id: string
          is_member: boolean
          name: string | null
          phone: string | null
          reservation_expires_at: string | null
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "rsvps"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      upsert_guild_membership_from_stripe: {
        Args: {
          p_amount_cents: number
          p_cancel_at_period_end: boolean
          p_canceled_at?: string
          p_currency: string
          p_current_period_end?: string
          p_current_period_start?: string
          p_event_created: number
          p_event_id: string
          p_metadata: Json
          p_started_at: string
          p_status: string
          p_stripe_customer_id?: string
          p_stripe_subscription_id: string
          p_tier: string
          p_wallet_address: string
        }
        Returns: boolean
      }
      upsert_transaction_from_stripe: {
        Args: {
          p_amount_cents: number
          p_currency: string
          p_description: string
          p_event_created: number
          p_event_id: string
          p_metadata: Json
          p_status: string
          p_stripe_ref: string
          p_type: string
        }
        Returns: boolean
      }
    }
    Enums: {
      application_stage: "WRITING" | "RECORDING" | "RELEASED" | "TOURING"
      application_status:
        | "PENDING"
        | "REVIEWING"
        | "INVITED"
        | "DECLINED"
        | "PARTNER"
      element_type: "studios" | "presence" | "foundation" | "press" | "law"
      project_status:
        | "DEVELOPMENT"
        | "RECORDING"
        | "MIXING"
        | "MASTERING"
        | "RELEASING"
        | "RELEASED"
      project_type: "SINGLE" | "EP" | "ALBUM" | "FILM_SCORE" | "COMPILATION"
      revenue_source:
        | "SYNC"
        | "DISTRIBUTION"
        | "VINYL"
        | "SERVICE_FEE"
        | "STIPEND"
      user_role: "VISITOR" | "ARTIST" | "ADMIN" | "FOUNDER"
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
      application_stage: ["WRITING", "RECORDING", "RELEASED", "TOURING"],
      application_status: [
        "PENDING",
        "REVIEWING",
        "INVITED",
        "DECLINED",
        "PARTNER",
      ],
      element_type: ["studios", "presence", "foundation", "press", "law"],
      project_status: [
        "DEVELOPMENT",
        "RECORDING",
        "MIXING",
        "MASTERING",
        "RELEASING",
        "RELEASED",
      ],
      project_type: ["SINGLE", "EP", "ALBUM", "FILM_SCORE", "COMPILATION"],
      revenue_source: [
        "SYNC",
        "DISTRIBUTION",
        "VINYL",
        "SERVICE_FEE",
        "STIPEND",
      ],
      user_role: ["VISITOR", "ARTIST", "ADMIN", "FOUNDER"],
    },
  },
} as const

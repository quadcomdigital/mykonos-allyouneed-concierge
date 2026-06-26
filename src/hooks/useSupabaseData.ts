import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useVillas = () =>
  useQuery({
    queryKey: ["villas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("villas")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useVillaBySlug = (slug: string) =>
  useQuery({
    queryKey: ["villas", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("villas")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

export const useApartments = () =>
  useQuery({
    queryKey: ["apartments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartments")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useApartmentBySlug = (slug: string) =>
  useQuery({
    queryKey: ["apartments", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartments")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

export const useYachts = () =>
  useQuery({
    queryKey: ["yachts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("yachts")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

export const useYachtBySlug = (slug: string) =>
  useQuery({
    queryKey: ["yachts", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("yachts")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

export const useVenues = () =>
  useQuery({
    queryKey: ["venues"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

export const useVenueBySlug = (slug: string) =>
  useQuery({
    queryKey: ["venues", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

export const useEvents = () =>
  useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_active", true)
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

export const useVehicles = () =>
  useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, LogOut, Home, Building, Car, Ship, MapPin, Calendar, ClipboardList, Upload, X, Image } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import logoAln from "@/assets/logo-aln.png";

type Section = "villas" | "apartments" | "vehicles" | "yachts" | "venues" | "events" | "bookings";
type FieldType = "text" | "textarea" | "number" | "boolean" | "array" | "cover" | "gallery";

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const sectionConfig: Record<Section, { label: string; icon: typeof Home; fields: FieldConfig[] }> = {
  villas: {
    label: "Ville",
    icon: Home,
    fields: [
      { key: "name", label: "Nome", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "zone", label: "Zona", type: "text" },
      { key: "capacity", label: "Capacità", type: "number" },
      { key: "bedrooms", label: "Camere", type: "number" },
      { key: "bathrooms", label: "Bagni", type: "number" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "description", label: "Descrizione", type: "textarea" },
      { key: "price_range", label: "Fascia prezzo", type: "text" },
      { key: "amenities", label: "Servizi (separati da virgola)", type: "array" },
      { key: "highlights", label: "Highlights (separati da virgola)", type: "array" },
      { key: "distances", label: "Distanze (JSON: [{\"label\":\"...\",\"time\":\"...\"}])", type: "textarea" },
      { key: "is_featured", label: "In evidenza (homepage)", type: "boolean" },
      { key: "cover_image", label: "Immagine di copertina", type: "cover" },
      { key: "gallery_images", label: "Gallery", type: "gallery" },
    ],
  },
  apartments: {
    label: "Appartamenti",
    icon: Building,
    fields: [
      { key: "name", label: "Nome", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "zone", label: "Zona", type: "text" },
      { key: "capacity", label: "Capacità", type: "number" },
      { key: "bedrooms", label: "Camere", type: "number" },
      { key: "bathrooms", label: "Bagni", type: "number" },
      { key: "has_kitchen", label: "Cucina", type: "boolean" },
      { key: "pool_type", label: "Piscina (none/shared/jacuzzi)", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "description", label: "Descrizione", type: "textarea" },
      { key: "highlights", label: "Highlights (separati da virgola)", type: "array" },
      { key: "amenities", label: "Servizi (separati da virgola)", type: "array" },
      { key: "guest_options", label: "Opzioni ospiti (es: 2,4,6)", type: "array" },
      { key: "is_featured", label: "In evidenza (homepage)", type: "boolean" },
      { key: "cover_image", label: "Immagine di copertina", type: "cover" },
      { key: "gallery_images", label: "Gallery", type: "gallery" },
    ],
  },
  vehicles: {
    label: "Veicoli",
    icon: Car,
    fields: [
      { key: "name", label: "Nome", type: "text" },
      { key: "category", label: "Categoria (Auto/Jeep/ATV/Scooter)", type: "text" },
      { key: "cover_image", label: "Immagine", type: "cover" },
      { key: "price_low", label: "Prezzo bassa stagione", type: "text" },
      { key: "price_mid", label: "Prezzo media stagione", type: "text" },
      { key: "price_high", label: "Prezzo alta stagione", type: "text" },
      { key: "is_featured", label: "In evidenza (homepage)", type: "boolean" },
      { key: "sort_order", label: "Ordinamento", type: "number" },
    ],
  },
  yachts: {
    label: "Yacht",
    icon: Ship,
    fields: [
      { key: "name", label: "Nome", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "model", label: "Modello", type: "text" },
      { key: "length", label: "Lunghezza", type: "text" },
      { key: "guests", label: "Ospiti", type: "number" },
      { key: "overnight_guests", label: "Ospiti pernottamento", type: "number" },
      { key: "cabins", label: "Cabine", type: "number" },
      { key: "crew", label: "Equipaggio", type: "number" },
      { key: "speed", label: "Velocità", type: "text" },
      { key: "year", label: "Anno", type: "text" },
      { key: "engines", label: "Motori", type: "text" },
      { key: "description_it", label: "Descrizione IT", type: "textarea" },
      { key: "description_en", label: "Descrizione EN", type: "textarea" },
      { key: "includes", label: "Servizi inclusi (separati da virgola)", type: "array" },
      { key: "is_featured", label: "In evidenza (homepage)", type: "boolean" },
      { key: "cover_image", label: "Immagine di copertina", type: "cover" },
      { key: "gallery_images", label: "Gallery", type: "gallery" },
    ],
  },
  venues: {
    label: "Locali",
    icon: MapPin,
    fields: [
      { key: "name", label: "Nome", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "category", label: "Categoria (restaurant/beachclub/club)", type: "text" },
      { key: "zone", label: "Zona", type: "text" },
      { key: "description", label: "Descrizione breve", type: "textarea" },
      { key: "long_description", label: "Descrizione estesa", type: "textarea" },
      { key: "opening_hours", label: "Orari", type: "text" },
      { key: "season", label: "Stagione", type: "text" },
      { key: "dress_code", label: "Dress code", type: "text" },
      { key: "cuisine", label: "Cucina", type: "text" },
      { key: "music_style", label: "Stile musicale", type: "text" },
      { key: "vibe", label: "Vibe (separati da virgola)", type: "array" },
      { key: "highlights", label: "Highlights (separati da virgola)", type: "array" },
      { key: "sort_order", label: "Ordinamento", type: "number" },
      { key: "is_featured", label: "In evidenza (homepage)", type: "boolean" },
      { key: "cover_image", label: "Immagine di copertina", type: "cover" },
      { key: "gallery_images", label: "Gallery", type: "gallery" },
    ],
  },
  events: {
    label: "Eventi",
    icon: Calendar,
    fields: [
      { key: "date", label: "Data (YYYY-MM-DD)", type: "text" },
      { key: "dj", label: "DJ / Artista", type: "text" },
      { key: "venue_name", label: "Nome locale", type: "text" },
      { key: "venue_slug", label: "Slug locale", type: "text" },
      { key: "description", label: "Descrizione", type: "textarea" },
      { key: "cover_image", label: "Immagine", type: "cover" },
      { key: "tag", label: "Tag", type: "text" },
      { key: "time", label: "Orario", type: "text" },
      { key: "highlight", label: "In evidenza", type: "boolean" },
    ],
  },
  bookings: {
    label: "Prenotazioni",
    icon: ClipboardList,
    fields: [
      { key: "service_type", label: "Tipo servizio", type: "text" },
      { key: "service_name", label: "Nome servizio", type: "text" },
      { key: "customer_name", label: "Nome cliente", type: "text" },
      { key: "customer_email", label: "Email", type: "text" },
      { key: "customer_phone", label: "Telefono", type: "text" },
      { key: "check_in", label: "Check-in (YYYY-MM-DD)", type: "text" },
      { key: "check_out", label: "Check-out (YYYY-MM-DD)", type: "text" },
      { key: "guests", label: "Ospiti", type: "number" },
      { key: "message", label: "Messaggio", type: "textarea" },
      { key: "status", label: "Stato", type: "text" },
      { key: "notes", label: "Note interne", type: "textarea" },
      { key: "forward_to", label: "Inoltra a (email partner)", type: "text" },
      { key: "forward_status", label: "Stato inoltro", type: "text" },
    ],
  },
};

const serviceTypeLabels: Record<string, string> = {
  villa: "Villa", apartment: "Appartamento", rental: "Noleggio",
  yacht: "Yacht", transfer: "Transfer", venue: "Locale", event: "Evento",
  concierge: "Concierge", boat_party: "Boat Party", candidatura: "Candidatura",
  contatto: "Contatto",
};
const statusLabels: Record<string, string> = {
  pending: "In attesa", confirmed: "Confermato", cancelled: "Cancellato", completed: "Completato",
};
const forwardStatusLabels: Record<string, string> = {
  pending: "Da inoltrare", forwarded: "Inoltrato",
};
const statusVariant = (s: string) => {
  if (s === "confirmed") return "default" as const;
  if (s === "cancelled") return "destructive" as const;
  if (s === "completed") return "secondary" as const;
  return "outline" as const;
};

// Maps section + field virtual keys to actual DB columns
const getDbImageFields = (section: Section): { coverCol: string; galleryCol: string | null } => {
  if (section === "vehicles") return { coverCol: "image_url", galleryCol: null };
  if (section === "events") return { coverCol: "image_url", galleryCol: null };
  if (section === "venues") return { coverCol: "image_url", galleryCol: "gallery" };
  // villas, apartments, yachts use "images" array where [0] = cover
  return { coverCol: "images", galleryCol: "images" };
};

const getStorageUrl = (path: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/media/${path}`;

const Admin = () => {
  const [activeSection, setActiveSection] = useState<Section>("villas");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [bookingFilter, setBookingFilter] = useState<string>("all");
  const [bookingTypeFilter, setBookingTypeFilter] = useState<string>("all");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: result, error } = await supabase
      .from(activeSection)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      setData(result || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  // Extract cover/gallery from DB item
  const extractImages = (item: any): { cover: string; gallery: string[] } => {
    const { coverCol, galleryCol } = getDbImageFields(activeSection);
    if (coverCol === "images") {
      const imgs = Array.isArray(item.images) ? item.images : [];
      return { cover: imgs[0] || "", gallery: imgs.slice(1) };
    }
    return {
      cover: item[coverCol] || "",
      gallery: galleryCol ? (Array.isArray(item[galleryCol]) ? item[galleryCol] : []) : [],
    };
  };

  const openCreateDialog = () => {
    setEditItem(null);
    const initial: Record<string, any> = {};
    sectionConfig[activeSection].fields.forEach((f) => {
      if (f.type === "cover") initial[f.key] = "";
      else if (f.type === "gallery") initial[f.key] = [];
      else if (f.type === "number") initial[f.key] = 0;
      else if (f.type === "boolean") initial[f.key] = false;
      else initial[f.key] = "";
    });
    setFormData(initial);
    setDialogOpen(true);
  };

  const openEditDialog = (item: any) => {
    setEditItem(item);
    const initial: Record<string, any> = {};
    const { cover, gallery } = extractImages(item);
    sectionConfig[activeSection].fields.forEach((f) => {
      if (f.type === "cover") {
        initial[f.key] = cover;
      } else if (f.type === "gallery") {
        initial[f.key] = gallery;
      } else if (f.key === "distances") {
        initial[f.key] = item[f.key] ? JSON.stringify(item[f.key], null, 2) : "";
      } else if (f.type === "array") {
        initial[f.key] = Array.isArray(item[f.key]) ? item[f.key].join(", ") : "";
      } else {
        initial[f.key] = item[f.key] ?? "";
      }
    });
    setFormData(initial);
    setDialogOpen(true);
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) {
      toast({ title: "Errore upload", description: error.message, variant: "destructive" });
      return null;
    }
    return getStorageUrl(path);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file, `${activeSection}/covers`);
    if (url) setFormData((p) => ({ ...p, cover_image: url }));
    setUploading(false);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadFile(file, `${activeSection}/gallery`);
      if (url) urls.push(url);
    }
    setFormData((p) => ({ ...p, gallery_images: [...(p.gallery_images || []), ...urls] }));
    setUploading(false);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const removeGalleryImage = (index: number) => {
    setFormData((p) => ({
      ...p,
      gallery_images: (p.gallery_images || []).filter((_: string, i: number) => i !== index),
    }));
  };

  const handleSave = async () => {
    const fields = sectionConfig[activeSection].fields;
    const payload: Record<string, any> = {};
    const { coverCol, galleryCol } = getDbImageFields(activeSection);

    fields.forEach((f) => {
      if (f.type === "cover" || f.type === "gallery") return; // handled below
      if (f.key === "distances") {
        // Parse JSON for distances field
        try {
          payload[f.key] = formData[f.key] ? JSON.parse(formData[f.key]) : null;
        } catch {
          payload[f.key] = null;
        }
      } else if (f.key === "guest_options") {
        // Array of numbers
        payload[f.key] = formData[f.key] ? String(formData[f.key]).split(",").map((s: string) => parseInt(s.trim())).filter((n: number) => !isNaN(n)) : [];
      } else if (f.type === "array") {
        payload[f.key] = formData[f.key] ? String(formData[f.key]).split(",").map((s: string) => s.trim()).filter(Boolean) : [];
      } else if (f.type === "number") {
        payload[f.key] = Number(formData[f.key]) || 0;
      } else if (f.type === "boolean") {
        payload[f.key] = formData[f.key] === true || formData[f.key] === "true";
      } else {
        payload[f.key] = formData[f.key] || null;
      }
    });

    // Build image columns
    const hasCover = fields.some((f) => f.type === "cover");
    const hasGallery = fields.some((f) => f.type === "gallery");

    if (hasCover) {
      const coverUrl = formData.cover_image || "";
      const galleryUrls: string[] = formData.gallery_images || [];

      if (coverCol === "images") {
        // Combined array: cover first, then gallery
        payload.images = coverUrl ? [coverUrl, ...galleryUrls] : galleryUrls;
      } else {
        payload[coverCol] = coverUrl || null;
        if (hasGallery && galleryCol && galleryCol !== coverCol) {
          payload[galleryCol] = galleryUrls;
        }
      }
    }

    let error;
    if (editItem) {
      ({ error } = await supabase.from(activeSection).update(payload as any).eq("id", editItem.id));
    } else {
      ({ error } = await supabase.from(activeSection).insert(payload as any));
    }

    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editItem ? "Aggiornato!" : "Creato!" });
      setDialogOpen(false);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo elemento?")) return;
    const { error } = await supabase.from(activeSection).delete().eq("id", id);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Eliminato!" });
      fetchData();
    }
  };

  const config = sectionConfig[activeSection];
  const pendingCount = activeSection === "bookings" ? data.filter((item) => item.status === "pending").length : 0;
  const filteredData = activeSection === "bookings"
    ? data.filter((item) => {
        if (bookingFilter !== "all" && item.status !== bookingFilter) return false;
        if (bookingTypeFilter !== "all" && item.service_type !== bookingTypeFilter) return false;
        return true;
      })
    : data;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-foreground text-primary-foreground flex flex-col shrink-0">
        <div className="p-6 border-b border-primary-foreground/10">
          <img src={logoAln} alt="All You Need" className="h-10 w-auto brightness-0 invert" />
          <p className="text-primary-foreground/40 text-[10px] mt-2 uppercase tracking-wider">Content Management</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {(Object.keys(sectionConfig) as Section[]).map((key) => {
            const s = sectionConfig[key];
            return (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeSection === key
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-accent/20"
                    : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5"
                }`}
              >
                <s.icon className="h-4 w-4" />
                {s.label}
                {key === "bookings" && pendingCount > 0 && (
                  <span className="ml-auto bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{pendingCount}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-primary-foreground/10">
          <Button variant="ghost" onClick={handleLogout} className="w-full text-primary-foreground/60 hover:text-primary-foreground justify-start gap-2">
            <LogOut className="h-4 w-4" /> Esci
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl">{config.label}</h1>
            <p className="text-muted-foreground text-sm mt-1">{filteredData.length} elementi</p>
          </div>
          <div className="flex items-center gap-3">
            {activeSection === "bookings" && (
              <>
                <Select value={bookingTypeFilter} onValueChange={setBookingTypeFilter}>
                  <SelectTrigger className="w-[160px] rounded-full">
                    <SelectValue placeholder="Tipo servizio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i tipi</SelectItem>
                    {Object.entries(serviceTypeLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={bookingFilter} onValueChange={setBookingFilter}>
                  <SelectTrigger className="w-[160px] rounded-full">
                    <SelectValue placeholder="Filtra stato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti gli stati</SelectItem>
                    <SelectItem value="pending">In attesa</SelectItem>
                    <SelectItem value="confirmed">Confermati</SelectItem>
                    <SelectItem value="cancelled">Cancellati</SelectItem>
                    <SelectItem value="completed">Completati</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
            <Button onClick={openCreateDialog} className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground gap-2">
              <Plus className="h-4 w-4" /> Aggiungi
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Caricamento...</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">Nessun elemento trovato</p>
            <Button onClick={openCreateDialog} variant="outline" className="rounded-full gap-2">
              <Plus className="h-4 w-4" /> Aggiungi il primo
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/30 overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  {activeSection === "bookings" ? (
                    <>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Servizio</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Fonte</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead>Inoltro</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead className="w-16"></TableHead>
                      <TableHead>Nome</TableHead>
                      {activeSection === "vehicles" && <TableHead>Categoria</TableHead>}
                      {activeSection === "events" && <TableHead>Data</TableHead>}
                      {activeSection === "events" && <TableHead>Locale</TableHead>}
                      {(activeSection === "villas" || activeSection === "apartments") && <TableHead>Zona</TableHead>}
                      {(activeSection === "villas" || activeSection === "apartments") && <TableHead>Capacità</TableHead>}
                      <TableHead>Stato</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => {
                  const { cover } = activeSection !== "bookings" ? extractImages(item) : { cover: "" };
                  return (
                    <TableRow key={item.id}>
                      {activeSection === "bookings" ? (
                        <>
                          <TableCell>
                            <div className="font-medium">{item.customer_name}</div>
                            <div className="text-xs text-muted-foreground">{item.customer_email}</div>
                            {item.customer_phone && <div className="text-xs text-muted-foreground">{item.customer_phone}</div>}
                          </TableCell>
                          <TableCell>
                            <div className="text-xs uppercase tracking-wider text-muted-foreground">{serviceTypeLabels[item.service_type] || item.service_type}</div>
                            <div className="text-sm">{item.service_name || "—"}</div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {item.check_in ? `${item.check_in}${item.check_out ? ` → ${item.check_out}` : ""}` : "—"}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.source === "whatsapp" ? "bg-green-500/10 text-green-600" : "bg-primary/10 text-primary"}`}>
                              {item.source === "whatsapp" ? "WhatsApp" : "Sito"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusVariant(item.status)} className="text-[10px]">
                              {statusLabels[item.status] || item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {item.forward_to ? (
                              <div>
                                <div className="text-xs text-muted-foreground truncate max-w-[120px]">{item.forward_to}</div>
                                <span className={`text-[9px] font-semibold ${item.forward_status === "forwarded" ? "text-green-600" : "text-amber-600"}`}>
                                  {forwardStatusLabels[item.forward_status] || "—"}
                                </span>
                              </div>
                            ) : <span className="text-muted-foreground text-xs">—</span>}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>
                            {cover ? (
                              <img src={cover} alt="" className="w-12 h-12 rounded-lg object-cover" />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                                <Image className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{item.name || item.dj}</TableCell>
                          {activeSection === "vehicles" && <TableCell>{item.category}</TableCell>}
                          {activeSection === "events" && <TableCell>{item.date}</TableCell>}
                          {activeSection === "events" && <TableCell>{item.venue_name}</TableCell>}
                          {(activeSection === "villas" || activeSection === "apartments") && <TableCell>{item.zone}</TableCell>}
                          {(activeSection === "villas" || activeSection === "apartments") && <TableCell>{item.capacity}</TableCell>}
                          <TableCell>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.is_active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                              {item.is_active ? "Attivo" : "Bozza"}
                            </span>
                          </TableCell>
                        </>
                      )}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editItem ? "Modifica" : "Aggiungi"} {config.label.slice(0, -1)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {config.fields.map((field) => (
              <div key={field.key}>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">{field.label}</Label>

                {/* Cover image upload */}
                {field.type === "cover" ? (
                  <div className="mt-2">
                    {formData.cover_image ? (
                      <div className="relative inline-block">
                        <img src={formData.cover_image} alt="Cover" className="w-full max-w-xs h-40 object-cover rounded-xl border border-border" />
                        <button
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, cover_image: "" }))}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 w-full max-w-xs h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                        <input
                          ref={coverInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCoverUpload}
                          disabled={uploading}
                        />
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {uploading ? "Caricamento..." : "Carica copertina"}
                        </span>
                      </label>
                    )}
                  </div>
                ) : field.type === "gallery" ? (
                  /* Gallery image upload */
                  <div className="mt-2 space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      {(formData.gallery_images || []).map((url: string, i: number) => (
                        <div key={i} className="relative group">
                          <img src={url} alt="" className="w-full h-20 object-cover rounded-lg border border-border" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(i)}
                            className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                        <input
                          ref={galleryInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleGalleryUpload}
                          disabled={uploading}
                        />
                        <Plus className="h-4 w-4 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground mt-1">
                          {uploading ? "..." : "Aggiungi"}
                        </span>
                      </label>
                    </div>
                  </div>
                ) : activeSection === "bookings" && field.key === "service_type" ? (
                  <Select value={formData[field.key] || ""} onValueChange={(v) => setFormData((p) => ({ ...p, [field.key]: v }))}>
                    <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Seleziona tipo" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(serviceTypeLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : activeSection === "bookings" && field.key === "status" ? (
                  <Select value={formData[field.key] || "pending"} onValueChange={(v) => setFormData((p) => ({ ...p, [field.key]: v }))}>
                    <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : activeSection === "bookings" && field.key === "forward_status" ? (
                  <Select value={formData[field.key] || ""} onValueChange={(v) => setFormData((p) => ({ ...p, [field.key]: v }))}>
                    <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Stato inoltro" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nessuno</SelectItem>
                      {Object.entries(forwardStatusLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "textarea" ? (
                  <Textarea
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                    className="mt-1 rounded-xl min-h-[100px]"
                  />
                ) : field.type === "boolean" ? (
                  <div className="mt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData[field.key] === true || formData[field.key] === "true"}
                        onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">{field.label}</span>
                    </label>
                  </div>
                ) : (
                  <Input
                    type={field.type === "number" ? "number" : "text"}
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                    className="mt-1 rounded-xl"
                  />
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} disabled={uploading} className="flex-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                {editItem ? "Salva modifiche" : "Crea"}
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-full">
                Annulla
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;

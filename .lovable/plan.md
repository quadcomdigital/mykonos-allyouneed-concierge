# Piano: redesign luxury + mobile uniform

## 1. Hero homepage — slideshow sincronizzato
Carousel a 3 slide (auto-play 6s, fade): immagine + headline + sottotitolo cambiano insieme. Indicatori minimal.

Copy proposto:
1. **"Mykonos, senza pensieri."** — *Concierge dedicato, scelte curate, zero stress logistico.*
2. **"Il lusso è non doversi occupare di nulla."** — *Ville, yacht e transfer coordinati da un unico referente.*
3. **"La tua vacanza, già pronta."** — *Disponibilità in tempo reale, risposta in 30 minuti.*

CTA invariato "Scopri di più".

## 2. Quick-pick chips → Highlights Instagram-style
- Aggiungo campo `is_featured` (boolean) + `featured_image` (text, opzionale) a `villas`, `apartments`, `yachts`, `venues`. Admin sceglie cosa mettere "in evidenza".
- I bollini sotto la hero diventano **highlights**: stile IG (cerchio con bordo gradient teal→gold, immagine custom o foto principale, etichetta sotto in maiuscoletto).
- **Mobile**: tap su bollino → bottom sheet con card swipeable (stile screenshot allegato: pallini in alto, card grande con immagine + nome + zona + 3 chip metadati + "Prenota ora" + "Apri scheda completa"). Filtra per categoria selezionata.
- **Desktop**: tap su bollino → naviga direttamente alla pagina dell'item evidenziato.
- Se nessun item è `is_featured` in una categoria, fallback ai primi N attivi.

## 3. Pagine catalogo — Ville / Appartamenti / Noleggio
- **Toolbar di ricerca** (replica screenshot): input "Cerca nome, tipo, zona…" + bottone "Filtri" + bottone "In evidenza" (sort), conteggio risultati sotto con icona sparkle.
- **Card più piccole e luxury**: ratio invariato ma padding/font ridotti del ~15%. Aggiungo **badge prezzo "da €X / notte"** in alto a destra sopra l'immagine (glass + accent). Per noleggio: "da €X / giorno".
- Layout più editoriale: micro-divider oro tra titolo e meta, hover sottile con glow accent, pulsante CTA "Vedi dettaglio" più definito.
- Riduco titolo hero pagina e padding sezioni.

## 4. Pagina dettaglio mezzo (`/rentals` singolo)
Attualmente piatta. Redesign:
- Hero compatto: immagine mezzo a sinistra (card flottante) + a destra titolo, categoria, descrizione, "Risposta media 30–60 minuti", CTA "Prenota ora" / "Contatta il concierge" / "Salva".
- Sezione **Tariffe stagionali** in 3 colonne (Bassa / Media / Alta) invece di una sola.
- Calendario noleggio + form concierge affiancati (come già è ma con spacing migliore e card più eleganti).
- Sezione "Perché sceglierci" / trust signals (consegna rapida, assistenza H24, cambio mezzo gratuito).

## 5. Social section — più originale
Layout asimmetrico tipo bento: 1 reel TikTok phone mockup grande a sinistra (verticale), griglia 2×2 Instagram a destra con un tile "card" che mostra @handle + follower count + CTA "Seguici". Bordi rounded-3xl con hover scale + glow accent.

## 6. Sezioni "Ospiti dicono" e "Consigli viaggio"
Riduco font heading da `text-2xl md:text-4xl` a `text-xl md:text-3xl`, padding sezione `py-20` → `py-12`, card recensioni/consigli più compatte (~80% dimensioni attuali).

## 7. Mobile uniform
Tutti i nuovi componenti pensati mobile-first (390px snap scroll dove serve, bottom sheet per highlights, toolbar ricerca sticky in alto su catalogo).

---

## File modificati
- `src/pages/Index.tsx` (hero carousel, highlights row, social bento, sezioni ridotte)
- `src/components/home/HeroCarousel.tsx` (nuovo)
- `src/components/home/HighlightsRow.tsx` (nuovo)
- `src/components/home/HighlightSheet.tsx` (nuovo, bottom sheet mobile)
- `src/components/catalog/SearchToolbar.tsx` (nuovo, condiviso ville/appartamenti/noleggi)
- `src/pages/Villas.tsx`, `src/pages/Apartments.tsx`, `src/pages/Rentals.tsx` (toolbar + card badge prezzo + scaling)
- `src/pages/AccommodationDetail.tsx` o nuovo `src/pages/VehicleDetail.tsx` per il mezzo (dipende dall'attuale routing)
- `src/pages/Admin.tsx` (toggle "In evidenza" + upload immagine highlight)

## Migration DB
```sql
ALTER TABLE villas ADD COLUMN is_featured boolean DEFAULT false, ADD COLUMN featured_image text;
ALTER TABLE apartments ADD COLUMN is_featured boolean DEFAULT false, ADD COLUMN featured_image text;
ALTER TABLE yachts ADD COLUMN is_featured boolean DEFAULT false, ADD COLUMN featured_image text;
ALTER TABLE venues ADD COLUMN is_featured boolean DEFAULT false, ADD COLUMN featured_image text;
ALTER TABLE vehicles ADD COLUMN is_featured boolean DEFAULT false, ADD COLUMN featured_image text;
```

## Da confermare
1. Hero copy: ok le 3 frasi proposte sopra o ne vuoi altre?
2. Per il prezzo "da €X / notte" sulle card: uso `price_range` esistente (parsing del primo numero) o aggiungo campo dedicato `price_from`?
3. Per il dettaglio mezzo, le 3 fasce tariffarie (Bassa/Media/Alta) usano i campi già esistenti `price_low/mid/high`?

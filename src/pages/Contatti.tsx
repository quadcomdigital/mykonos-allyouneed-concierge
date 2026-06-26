import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import heroImg from "@/assets/contatti-hero.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const Contatti = () => {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formElements = form.elements as any;
    await supabase.from("bookings").insert({
      service_type: "contatto",
      service_name: formElements[4]?.value || "Contatto generico",
      customer_name: `${formElements[0]?.value || ""} ${formElements[1]?.value || ""}`.trim(),
      customer_email: formElements[2]?.value || null,
      customer_phone: formElements[3]?.value || null,
      message: formElements[5]?.value || null,
      source: "website",
    } as any);
    toast({
      title: "Messaggio inviato!",
      description: "Ti risponderemo al più presto.",
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[55vh] overflow-hidden">
        <motion.img
          src={heroImg}
          alt=""
          className="w-full h-full object-cover"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-12 bg-accent" />
                <span className="text-accent text-xs font-semibold uppercase tracking-[0.35em]">
                  Get In Touch
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-8xl font-bold text-primary-foreground leading-[0.9] mb-4">
                Contatti
              </h1>
              <p className="text-primary-foreground/50 max-w-lg text-lg leading-relaxed">
                Siamo qui per ogni tua esigenza
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact info + WhatsApp + Form */}
      <section className="py-14 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
          >
            {/* Left — contact info */}
            <motion.div variants={fadeUp} className="space-y-8">
              <div>
                <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-4 block">
                  Contattaci
                </span>
                <h2 className="font-serif text-3xl md:text-5xl text-foreground leading-tight mb-6">
                  Parliamo della<br />tua vacanza
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                  Che tu abbia domande o voglia prenotare, siamo sempre disponibili per aiutarti.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "info@allyouneed.com", href: "mailto:info@allyouneed.com" },
                  { icon: Phone, label: "Telefono", value: "+39 000 000 0000", href: "tel:+390000000000" },
                  { icon: MapPin, label: "Sede", value: "Mykonos, Greece", href: undefined },
                  { icon: Clock, label: "Orari", value: "Lun-Dom: 9:00 - 23:00", href: undefined },
                ].map((item) => (
                  <div key={item.label} className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-accent/30 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{item.label}</span>
                      {item.href ? (
                        <a href={item.href} className="block text-foreground hover:text-primary transition-colors font-medium">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-foreground font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="rounded-3xl bg-gradient-to-r from-green-500 to-green-600 p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="h-8 w-8" />
                  <h3 className="font-serif text-2xl font-bold">WhatsApp</h3>
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  Il modo più rapido per contattarci. Rispondiamo entro pochi minuti durante gli orari di servizio.
                </p>
                <Button
                  size="lg"
                  className="rounded-full px-8 py-5 bg-white text-green-600 hover:bg-white/90 font-semibold shadow-lg"
                  asChild
                >
                  <a href="https://wa.me/393400000000" target="_blank" rel="noopener noreferrer">
                    Chatta con Noi <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div variants={fadeUp}>
              <div className="rounded-3xl bg-card border border-border/50 p-8 shadow-xl">
                <h3 className="font-serif text-2xl font-bold mb-6">Inviaci un messaggio</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nome</Label>
                      <Input required placeholder="Mario" className="mt-1 rounded-xl" />
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Cognome</Label>
                      <Input required placeholder="Rossi" className="mt-1 rounded-xl" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                    <Input type="email" required placeholder="mario@email.com" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Telefono</Label>
                    <Input type="tel" placeholder="+39 333 1234567" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Oggetto</Label>
                    <Input required placeholder="es. Informazioni prenotazione villa" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Messaggio</Label>
                    <Textarea
                      required
                      placeholder="Scrivi il tuo messaggio..."
                      className="mt-1 rounded-xl min-h-[140px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-lg shadow-primary/20 py-6 text-base font-semibold"
                  >
                    Invia Messaggio <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contatti;

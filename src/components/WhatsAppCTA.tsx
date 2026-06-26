import { MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface WhatsAppCTAProps {
  serviceType: string;
  serviceName: string;
  message?: string;
  label?: string;
  phone?: string;
  className?: string;
  variant?: "default" | "green" | "outline";
  size?: "default" | "lg";
  /** Also save to CRM bookings table */
  saveToDb?: boolean;
}

const WhatsAppCTA = ({
  serviceType,
  serviceName,
  message,
  label = "Contatta su WhatsApp",
  phone = "393400000000",
  className,
  variant = "default",
  size = "default",
  saveToDb = true,
}: WhatsAppCTAProps) => {
  const defaultMsg = `Ciao, vorrei informazioni su ${serviceName}`;
  const waMessage = message || defaultMsg;

  const handleClick = async () => {
    // Save to DB in background
    if (saveToDb) {
      supabase.from("bookings").insert({
        service_type: serviceType,
        service_name: serviceName,
        customer_name: "WhatsApp Lead",
        message: waMessage,
        source: "whatsapp",
      } as any).then(() => {});
    }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`, "_blank");
  };

  const baseClasses = size === "lg" ? "rounded-full px-8 py-5 text-sm font-semibold" : "rounded-full px-6 py-4 text-sm font-medium";

  if (variant === "green") {
    return (
      <Button onClick={handleClick} className={`${baseClasses} border-0 shadow-lg ${className}`} style={{ backgroundColor: '#25D366', color: 'white' }}>
        <MessageCircle className="mr-2 h-4 w-4" /> {label}
      </Button>
    );
  }

  if (variant === "outline") {
    return (
      <Button variant="outline" onClick={handleClick} className={`${baseClasses} border-border/30 hover:border-accent/40 hover:bg-accent/5 ${className}`}>
        <MessageCircle className="mr-2 h-4 w-4 text-accent" /> {label}
      </Button>
    );
  }

  return (
    <Button onClick={handleClick} className={`${baseClasses} bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-lg shadow-accent/15 border-0 ${className}`}>
      {label} <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default WhatsAppCTA;

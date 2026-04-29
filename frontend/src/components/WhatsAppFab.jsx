import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "../lib/constants";

export default function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 group"
      data-testid="whatsapp-fab"
    >
      <span className="absolute inset-0 rounded-full bg-paradise-green animate-pulse-ring" aria-hidden="true" />
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-paradise-green text-white shadow-[0_12px_30px_rgba(0,200,150,0.55)] group-hover:scale-105 transition-transform duration-300">
        <MessageCircle className="w-6 h-6" />
      </span>
    </a>
  );
}

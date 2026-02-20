import { memo } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const MapEmbed = memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="glass-card overflow-hidden mt-10"
    >
      <div className="p-4 flex items-center gap-2 border-b border-border">
        <MapPin size={16} className="text-primary" />
        <span className="text-sm font-medium text-foreground">Jalpaiguri, West Bengal, India</span>
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57233.66839489284!2d88.6616518!3d26.5382481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e4795a4544dc7b%3A0xfd44f1fea54c9c40!2sJalpaiguri%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Location - Jalpaiguri, West Bengal"
        className="w-full"
      />
    </motion.div>
  );
});

MapEmbed.displayName = "MapEmbed";
export default MapEmbed;

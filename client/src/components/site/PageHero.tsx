import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: ReactNode; description?: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 -z-10 grain opacity-30" />
      <div className="container-wide pt-20 pb-14 sm:pt-24 sm:pb-20 md:pt-32 md:pb-28">
        <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 sm:mt-6 font-display text-[clamp(1.875rem,5.5vw,5.75rem)] leading-[1.02] sm:leading-[0.98] tracking-tight max-w-5xl display-balance break-words"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 sm:mt-8 max-w-2xl text-[15px] sm:text-[17px] md:text-lg text-muted-foreground leading-relaxed sm:leading-[1.65] pretty"
          >
            {description}
          </motion.p>
        )}
      </div>
      <div className="hairline" />
    </section>
  );
}

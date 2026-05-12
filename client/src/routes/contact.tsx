import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Noctura Studio" },
      { name: "description", content: "Tell us about your project. We respond within one business day." },
      { property: "og:title", content: "Contact — Noctura Studio" },
      { property: "og:description", content: "Tell us about your project. We respond within one business day." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Start a conversation"
        title={<>Tell us what you're <span className="italic text-gold">building</span>.</>}
        description="We respond within one business day. For new projects, please share a bit about your timeline and budget so we can route you to the right person."
      />

      <section className="container-wide pb-32 grid lg:grid-cols-[1.4fr_1fr] gap-12">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="rounded-3xl border border-border bg-card p-8 md:p-12"
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Your name" id="name" placeholder="Helena Voss" />
            <Field label="Email" id="email" type="email" placeholder="helena@company.com" />
            <Field label="Company" id="company" placeholder="Atlas Capital" />
            <Field label="Budget" id="budget" placeholder="$50k – $100k" />
          </div>
          <div className="mt-5">
            <label htmlFor="msg" className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Project</label>
            <textarea id="msg" rows={6} placeholder="A few lines about what you're building, your timeline, and what success looks like."
              className="w-full rounded-2xl bg-background border border-border px-5 py-4 outline-none focus:border-gold transition-colors resize-none" />
          </div>
          <button type="submit" className="mt-8 inline-flex items-center gap-2 h-12 px-7 rounded-full bg-gold text-gold-foreground font-medium hover:opacity-90 transition-opacity">
            {sent ? "Thanks — we'll be in touch" : "Send inquiry"} <ArrowUpRight className="h-4 w-4" />
          </button>
        </motion.form>

        <div className="space-y-8">
          <InfoBlock icon={Mail} title="Email" lines={["hello@noctura.studio", "new@noctura.studio"]} />
          <InfoBlock icon={Phone} title="Phone" lines={["+46 8 555 1234"]} />
          <InfoBlock icon={MapPin} title="Studio" lines={["Hornsgatan 12", "118 20 Stockholm, Sweden"]} />

          <div className="rounded-3xl border border-border p-8 bg-surface">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Office hours</p>
            <p className="mt-3 font-display text-2xl">Mon — Fri · 09:00 — 18:00 CET</p>
            <p className="mt-2 text-muted-foreground">Currently booking projects starting in Q3 2026.</p>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, id, type = "text", placeholder }: { label: string; id: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{label}</label>
      <input id={id} type={type} placeholder={placeholder}
        className="w-full h-12 rounded-2xl bg-background border border-border px-5 outline-none focus:border-gold transition-colors" />
    </div>
  );
}

function InfoBlock({ icon: Icon, title, lines }: { icon: React.ComponentType<{ className?: string }>; title: string; lines: string[] }) {
  return (
    <div className="flex gap-5">
      <div className="h-12 w-12 rounded-2xl bg-gold/10 text-gold grid place-items-center shrink-0"><Icon className="h-5 w-5" /></div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
        {lines.map((l) => <p key={l} className="mt-1 text-foreground">{l}</p>)}
      </div>
    </div>
  );
}

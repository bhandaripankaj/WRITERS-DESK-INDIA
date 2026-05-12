import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Noctura Studio" },
      { name: "description", content: "An independent design and technology studio of seven, building quietly remarkable products since 2019." },
      { property: "og:title", content: "About — Noctura Studio" },
      { property: "og:description", content: "An independent design and technology studio of seven, building quietly remarkable products since 2019." },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { v: "120+", l: "Projects shipped" },
  { v: "07", l: "People in the studio" },
  { v: "14", l: "Awards earned" },
  { v: "98%", l: "Client retention" },
];

const team = [
  { n: "Iris Halden", r: "Founder & Creative Director" },
  { n: "Theo Park", r: "Design Lead" },
  { n: "Mira Lange", r: "Brand Strategist" },
  { n: "Jonas Vik", r: "Engineering Lead" },
  { n: "Sana Reyes", r: "Motion Director" },
  { n: "Leo Carter", r: "Producer" },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the studio"
        title={<>A small studio with <span className="italic text-gold">opinions</span> and an obsession with craft.</>}
        description="We're seven people in a quiet office in Stockholm. We work with founders and creative leaders who care as much about the small details as the headline outcomes."
      />

      <section className="container-wide py-16 md:py-24 grid lg:grid-cols-2 gap-16 items-start">
        <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-[oklch(0.3_0.05_70)] to-[oklch(0.16_0.02_50)]" style={{ boxShadow: "var(--shadow-elegant)" }} />
        <div>
          <SectionHeader eyebrow="Our philosophy" title={<>Restraint is the loudest <span className="italic text-gold">statement</span> a studio can make.</>} />
          <div className="mt-8 space-y-6 text-muted-foreground text-lg leading-relaxed">
            <p>We started Noctura because we wanted to work the way great architects work — with deep client partnerships, considered briefs, and time enough to do the work properly.</p>
            <p>Every engagement starts with strategy and ends with measurable craft. No ghost teams. No oversold scopes. Just the right people, doing focused work, in the open.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface border-y border-border">
        <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <p className="font-display text-5xl md:text-6xl text-gold">{s.v}</p>
              <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-wide py-24 md:py-32">
        <SectionHeader eyebrow="The team" title={<>Seven people. <span className="italic text-gold">One craft.</span></>} />
        <div className="mt-16 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {team.map((m, i) => (
            <motion.div key={m.n} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-[oklch(0.28_0.04_70)] to-[oklch(0.18_0.02_60)] border border-border" />
              <p className="mt-5 font-display text-xl">{m.n}</p>
              <p className="text-sm text-muted-foreground">{m.r}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

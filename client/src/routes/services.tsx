import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Noctura Studio" },
      { name: "description", content: "Brand strategy, product design, web engineering and motion. Four disciplines, one focused team." },
      { property: "og:title", content: "Services — Noctura Studio" },
      { property: "og:description", content: "Brand strategy, product design, web engineering and motion. Four disciplines, one focused team." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    n: "01",
    title: "Brand Strategy & Identity",
    desc: "We position your company in language that earns belief, then translate it into an identity system built to scale.",
    items: ["Brand audit & positioning", "Naming & narrative", "Visual identity system", "Guidelines & rollout"],
  },
  {
    n: "02",
    title: "Product & UX Design",
    desc: "From early sketches to a shippable design system — interfaces engineered for clarity, conversion and craft.",
    items: ["Product strategy", "End-to-end UX", "Design systems", "Prototyping & validation"],
  },
  {
    n: "03",
    title: "Web Engineering",
    desc: "Performant, accessible builds in the modern web stack. We sweat Lighthouse scores so you don't have to.",
    items: ["Marketing sites", "Headless commerce", "Web apps", "CMS integration"],
  },
  {
    n: "04",
    title: "Motion, 3D & Direction",
    desc: "Cinematic animation and immersive interaction that elevates story and rewards attention.",
    items: ["Brand films", "Web motion", "Real-time 3D", "Interactive direction"],
  },
];

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title={<>Four disciplines. <span className="italic text-gold">One</span> studio.</>}
        description="We're set up so strategy, design, engineering and motion can pull on the same thread — without handoffs that cost momentum."
      />

      <section className="container-wide pb-32 space-y-8">
        {services.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="card-luxe p-10 md:p-16 grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16"
          >
            <div>
              <span className="text-gold/80 font-display text-[15px] tracking-[0.3em]">— {s.n}</span>
              <h2 className="mt-4 font-display text-[30px] md:text-[40px] leading-[1.05] tracking-tight">{s.title}</h2>
            </div>
            <div>
              <p className="text-[17px] text-muted-foreground leading-[1.65] pretty max-w-xl">{s.desc}</p>
              <ul className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {s.items.map((it) => (
                  <li key={it} className="flex items-center gap-3 text-[15px] text-foreground/90 py-3 border-b border-border">
                    <span className="h-5 w-5 grid place-items-center rounded-full bg-gold/15 text-gold shrink-0"><Check className="h-3 w-3" /></span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}

        <div className="pt-16 text-center">
          <Link to="/contact" className="btn-primary">
            Discuss your project <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

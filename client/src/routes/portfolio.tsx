import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Noctura Studio" },
      {
        name: "description",
        content:
          "A selection of recent work across brand, product, web and motion.",
      },
      { property: "og:title", content: "Portfolio — Noctura Studio" },
      {
        property: "og:description",
        content:
          "A selection of recent work across brand, product, web and motion.",
      },
    ],
  }),
  component: PortfolioPage,
});

const work = [
  {
    title: "Atlas Capital",
    tag: "Finance · Identity · Web",
    year: "2026",
  },
  {
    title: "Lumen Studio",
    tag: "Brand · Identity",
    year: "2025",
  },
  {
    title: "Northwind",
    tag: "Product · App",
    year: "2025",
  },
  {
    title: "Verra Living",
    tag: "E-commerce · Web",
    year: "2024",
  },
  {
    title: "Obsidian Labs",
    tag: "Product · Brand",
    year: "2024",
  },
  {
    title: "Meridian Travel",
    tag: "Web · Motion",
    year: "2023",
  },
];

function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title={
          <>
            A few projects we're{" "}
            <span className="italic text-gold">proud</span> to share.
          </>
        }
        description="We work in long, deep engagements with a small number of clients each year. Here's a slice of recent work."
      />

      <section className="container-wide pb-20 sm:pb-28 md:pb-32 grid gap-8 sm:gap-10 md:grid-cols-2 min-w-0">
        {work.map((p, i) => (
          <motion.a
            key={p.title}
            href="#"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className={`group ${
              i % 3 === 0 ? "md:col-span-2" : ""
            }`}
          >
            <div
              className={`relative ${
                i % 3 === 0 ? "aspect-[16/8]" : "aspect-[4/3]"
              } rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-[oklch(0.3_0.05_70)] via-[oklch(0.22_0.04_60)] to-[oklch(0.16_0.02_50)]`}
            >
              <div className="absolute inset-0 grid place-items-center">
                <span className="font-display text-[clamp(1.25rem,5.5vw,3.25rem)] md:text-7xl opacity-30 group-hover:opacity-60 transition-opacity text-center px-3 max-w-full balance">
                  {p.title}
                </span>
              </div>

              <div className="absolute top-5 right-5 h-11 w-11 rounded-full bg-background/80 backdrop-blur grid place-items-center group-hover:bg-gold group-hover:text-gold-foreground transition-colors">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl">
                  {p.title}
                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  {p.tag}
                </p>
              </div>

              <span className="text-sm text-muted-foreground">
                {p.year}
              </span>
            </div>
          </motion.a>
        ))}
      </section>
    </>
  );
}
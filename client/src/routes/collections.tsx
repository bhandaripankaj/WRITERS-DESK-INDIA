import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { COLLECTIONS, previewBooksForCollection } from "@/data/books-catalog";

export const Route = createFileRoute("/collections")({
  component: CollectionsPage,
  head: () => ({
    meta: [{ title: "Collections — WhiteFalcon Publishing" }],
  }),
});

function CollectionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Browse by shelf"
        title={
          <>
            Book <span className="gradient-brand-text">collections</span>
          </>
        }
        description="Every shelf is curated for a different mood and moment. Open a collection, then use filters on the books page to narrow by category."
      />
      <section className="container-wide py-12 sm:py-16 md:py-20 min-w-0">
        <div className="grid gap-5 sm:gap-6 md:gap-8 sm:grid-cols-2 min-w-0">
          {COLLECTIONS.map((c, i) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="card-soft p-5 sm:p-6 md:p-7 flex flex-col min-w-0"
            >
              <div className="min-w-0">
                <h2 className="font-display text-lg sm:text-xl md:text-2xl break-words">{c.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.description}</p>
              </div>
              <div className="mt-5 sm:mt-6 grid grid-cols-4 gap-1.5 sm:gap-2 min-w-0">
                {previewBooksForCollection(c.id, 4).map((b) => (
                  <div
                    key={`${c.id}-${b.id}`}
                    className="aspect-[2/3] overflow-hidden rounded-md border border-border bg-surface"
                  >
                    <img src={b.cover} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-2 border-t border-border flex justify-end">
                <Link
                  to="/books"
                  search={{ collection: c.id }}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:gap-2.5 transition-all"
                >
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}

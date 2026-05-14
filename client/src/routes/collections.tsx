import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { collectionAPI } from "@/services/api";
const VITE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
interface CollectionItem {
  _id: string;
  name: string;
  description: string;
  ranking?: number;
  bookCount?: number;
  previewCovers?: string[];
}

export const Route = createFileRoute("/collections")({
  component: CollectionsPage,
  head: () => ({
    meta: [{ title: "Collections — WritersDesk Publishing" }],
  }),
});

function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await collectionAPI.getAll();
        const sorted = Array.isArray(data) ? [...data].sort((a, b) => (a.ranking ?? 0) - (b.ranking ?? 0)) : [];
        setCollections(sorted);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

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
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-16">Loading collections...</p>
        ) : collections.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-16">No collections available.</p>
        ) : (
          <div className="grid gap-5 sm:gap-6 md:gap-8 sm:grid-cols-2 min-w-0">
            {collections.map((c, i) => (
              <motion.article
                key={c._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="card-soft p-5 sm:p-6 md:p-7 flex flex-col min-w-0"
              >
                <div className="min-w-0">
                  <h2 className="font-display text-lg sm:text-xl md:text-2xl break-words">{c.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                </div>
                <div className="mt-5 sm:mt-6 grid grid-cols-4 gap-1.5 sm:gap-2 min-w-0">
                  {(c.previewCovers || []).map((cover, index) => (
                    <div
                      key={`${c._id}-${index}`}
                      className="aspect-[2/3] overflow-hidden rounded-md border border-border bg-surface"
                    >
                      <img src={VITE_IMAGE_URL + cover} alt="Book cover preview" className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-2 border-t border-border flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">{c.bookCount ?? 0} books</span>
                  <Link
                    to="/books"
                    search={{ collection: c._id }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:gap-2.5 transition-all"
                  >
                    View all <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

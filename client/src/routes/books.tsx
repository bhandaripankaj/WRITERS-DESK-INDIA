import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  CATEGORY_IDS,
  CATEGORY_LABELS,
  type CategoryId,
  COLLECTIONS,
  getCollectionMeta,
  isCategoryId,
  booksForCollectionAndCategories,
} from "@/data/books-catalog";

type BooksSearch = {
  collection?: string;
  categories?: string;
};

function parseSearch(raw: Record<string, unknown>): BooksSearch {
  const col = raw.collection;
  const collection =
    typeof col === "string" && col.length > 0 && COLLECTIONS.some((c) => c.id === col) ? col : undefined;

  const cat = raw.categories;
  let categories: string | undefined;
  if (typeof cat === "string" && cat.trim().length > 0) {
    const parts = cat
      .split(",")
      .map((s) => s.trim())
      .filter(isCategoryId);
    categories = parts.length > 0 ? parts.join(",") : undefined;
  }
  return { collection, categories };
}

function categoriesFromSearch(categories: string | undefined): CategoryId[] {
  if (!categories?.trim()) return [];
  return categories.split(",").map((s) => s.trim()).filter(isCategoryId);
}

export const Route = createFileRoute("/books")({
  validateSearch: (raw: Record<string, unknown>): BooksSearch => parseSearch(raw),
  component: BooksPage,
  head: () => ({
    meta: [{ title: "Books — WritersDesk Publishing" }],
  }),
});

function BooksPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const collection = search.collection;
  const selected = categoriesFromSearch(search.categories);
  const meta = getCollectionMeta(collection);
  const books = booksForCollectionAndCategories(collection, selected);

  const setCategories = (next: CategoryId[]) => {
    navigate({
      to: "/books",
      search: (prev) => ({
        collection: prev.collection,
        categories: next.length > 0 ? next.join(",") : undefined,
      }),
    });
  };

  const toggleCategory = (id: CategoryId) => {
    const set = new Set(selected);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    setCategories([...set]);
  };

  const clearCategories = () => {
    navigate({
      to: "/books",
      search: (prev) => ({
        collection: prev.collection,
        categories: undefined,
      }),
    });
  };

  return (
    <>
      <PageHero
        eyebrow={meta ? "Collection" : "Library"}
        title={
          meta ? (
            <>
              <span className="gradient-brand-text">{meta.title}</span>
            </>
          ) : (
            <>
              <span className="gradient-brand-text">Books</span> Store
            </>
          )
        }
        description={
          meta?.description ??
          "Browse the full catalog. Pick one or more categories below to narrow the list — by default every title in the current shelf is shown."
        }
      />

      <section className="container-wide py-10 sm:py-12 md:py-16 min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 min-w-0">
          <Link to="/collections" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
            <ArrowLeft className="h-4 w-4" />
            Back to collections
          </Link>
          {collection && (
            <p className="text-xs text-muted-foreground sm:text-right sm:max-w-md min-w-0 break-words">
              Showing books in <span className="text-foreground font-medium">{meta?.title ?? collection}</span>
              {selected.length > 0 ? ` · filtered by ${selected.map((c) => CATEGORY_LABELS[c]).join(", ")}` : ""}.
            </p>
          )}
        </div>

        <div className="card-soft p-4 sm:p-5 md:p-6 mb-8 sm:mb-10 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="font-display text-lg">Category filter</h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                Multi-select: a book appears if it matches any selected category. Leave all unchecked to show every book in this collection.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={clearCategories} className="text-xs font-medium text-brand hover:underline">
                Clear category filters
              </button>
            </div>
          </div>
          <div className="mt-4 sm:mt-5 flex flex-wrap gap-x-3 gap-y-2.5 sm:gap-x-5 sm:gap-y-3">
            {CATEGORY_IDS.map((id) => (
              <div key={id} className="flex items-center gap-2 min-h-9 min-w-0">
                <Checkbox
                  id={`cat-${id}`}
                  checked={selected.includes(id)}
                  onCheckedChange={() => toggleCategory(id)}
                />
                <Label htmlFor={`cat-${id}`} className="text-xs sm:text-sm font-normal cursor-pointer leading-snug">
                  {CATEGORY_LABELS[id]}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {books.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-16">No books match these filters. Try clearing categories.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 md:gap-6">
            {books.map((b) => (
              <div key={b.id} className="group flex flex-col min-w-0">
                <div className="relative overflow-hidden rounded-lg border border-border aspect-[2/3] bg-surface">
                  <img
                    src={b.cover}
                    alt={b.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 flex-1 flex flex-col">
                  <p className="font-display text-[13px] sm:text-sm leading-snug line-clamp-2">{b.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{b.author}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                    {b.categories.map((c) => CATEGORY_LABELS[c]).join(" · ")}
                  </p>
                  <Link to="/contact" className="mt-3 w-full text-center btn-outline !h-9 !text-xs py-0">
                    I&apos;m Interested
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

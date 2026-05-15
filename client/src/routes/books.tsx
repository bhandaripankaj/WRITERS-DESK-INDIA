import { Outlet, createFileRoute, useMatch, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { bookAPI, categoryAPI, collectionAPI } from "@/services/api";
const VITE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
type BooksSearch = {
  collection?: string;
  categories?: string;
};

function parseSearch(raw: Record<string, unknown>): BooksSearch {
  const collection = typeof raw.collection === "string" && raw.collection.length > 0 ? raw.collection : undefined;

  const cat = raw.categories;
  let categories: string | undefined;
  if (typeof cat === "string" && cat.trim().length > 0) {
    const parts = cat
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    categories = parts.length > 0 ? parts.join(",") : undefined;
  }

  return { collection, categories };
}

function categoriesFromSearch(categories: string | undefined): string[] {
  if (!categories?.trim()) return [];
  return categories.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
}

interface Category {
  _id: string;
  name: string;
}

interface Collection {
  _id: string;
  name: string;
  description?: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  cover: string;
  categories: Array<string | Category>;
  collections: Array<string | Collection>;
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
  const bookDetailMatch = useMatch({ from: "/books/$bookId", shouldThrow: false });
  const collectionId = search.collection;
  const selectedCategoryIds = categoriesFromSearch(search.categories);

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, categoriesData, collectionsData] = await Promise.all([
          bookAPI.getAll(),
          categoryAPI.getAll(),
          collectionAPI.getAll(),
        ]);

        setBooks(booksData);
        setCategories(categoriesData);
        setCollections(collectionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryName = (id: string) => categories.find((c) => c._id === id)?.name ?? id;
  const getCollectionName = (id: string) => collections.find((c) => c._id === id)?.name ?? id;

  const getBookCategoryNames = (book: Book) =>
    book.categories
      .map((category) => (typeof category === "string" ? getCategoryName(category) : category.name))
      .filter(Boolean);

  const getBookCollectionNames = (book: Book) =>
    book.collections
      .map((collection) => (typeof collection === "string" ? getCollectionName(collection) : collection.name))
      .filter(Boolean);

  const filteredBooks = books.filter((book) => {
    if (collectionId) {
      const bookCollectionIds = book.collections.map((collection) =>
        typeof collection === "string" ? collection : collection._id
      );
      if (!bookCollectionIds.includes(collectionId)) return false;
    }

    if (selectedCategoryIds.length > 0) {
      const bookCategoryIds = book.categories.map((category) =>
        typeof category === "string" ? category : category._id
      );
      const matches = selectedCategoryIds.some((categoryId) => bookCategoryIds.includes(categoryId));
      if (!matches) return false;
    }

    return true;
  });

  const selectedCollection = collections.find((c) => c._id === collectionId);

  const updateCategorySearch = (next: string[]) => {
    navigate({
      to: "/books",
      search: (prev) => ({
        collection: prev.collection,
        categories: next.length > 0 ? next.join(",") : undefined,
      }),
    });
  };

  const toggleCategory = (id: string) => {
    const set = new Set(selectedCategoryIds);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    updateCategorySearch([...set]);
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

  if (bookDetailMatch) {
    return <Outlet />;
  }

  return (
    <>
      <PageHero
        eyebrow={selectedCollection ? "Collection" : "Library"}
        title={
          selectedCollection ? (
            <>
              <span className="gradient-brand-text">{selectedCollection.name}</span>
            </>
          ) : (
            <>
              <span className="gradient-brand-text">Books</span> Store
            </>
          )
        }
        description={
          selectedCollection?.description ??
          "Browse the full catalog. Pick one or more categories below to narrow the list — by default every title in the current shelf is shown."
        }
      />

      <section className="container-wide py-10 sm:py-12 md:py-16 min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 min-w-0">
          <Link to="/collections" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
            <ArrowLeft className="h-4 w-4" />
            Back to collections
          </Link>
          {collectionId && (
            <p className="text-xs text-muted-foreground sm:text-right sm:max-w-md min-w-0 break-words">
              Showing books in <span className="text-foreground font-medium">{selectedCollection?.name ?? collectionId}</span>
              {selectedCategoryIds.length > 0 ? ` · filtered by ${selectedCategoryIds.map(getCategoryName).join(", ")}` : ""}.
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
            {categories.map((category) => (
              <div key={category._id} className="flex items-center gap-2 min-h-9 min-w-0">
                <Checkbox
                  id={`cat-${category._id}`}
                  checked={selectedCategoryIds.includes(category._id)}
                  onCheckedChange={() => toggleCategory(category._id)}
                />
                <Label htmlFor={`cat-${category._id}`} className="text-xs sm:text-sm font-normal cursor-pointer leading-snug">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-16">Loading books...</p>
        ) : filteredBooks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-16">No books match these filters. Try clearing categories.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 md:gap-6">
            {filteredBooks.map((b) => (
              <div key={b._id} className="group flex flex-col min-w-0">
                <div className="relative overflow-hidden rounded-lg border border-border aspect-[2/3] bg-surface">
                  <Link to={`/books/${b._id}`} className="block h-full w-full">
                    <img
                      src={VITE_IMAGE_URL + b.cover}
                      alt={b.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                </div>
                <div className="mt-3 flex-1 flex flex-col">
                  <p className="font-display text-[13px] sm:text-sm leading-snug line-clamp-2">{b.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{b.author}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                    {getBookCategoryNames(b).join(" · ")}
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

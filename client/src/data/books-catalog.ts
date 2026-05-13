import book1 from "@/assets/book-1.jpg";
import book2 from "@/assets/book-2.jpg";
import book3 from "@/assets/book-3.jpg";
import book4 from "@/assets/book-4.jpg";
import book5 from "@/assets/book-5.jpg";
import book6 from "@/assets/book-6.jpg";

export const CATEGORY_IDS = ["technology", "business", "self-growth", "finance", "fiction", "design"] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  technology: "Technology",
  business: "Business",
  "self-growth": "Self Growth",
  finance: "Finance",
  fiction: "Fiction",
  design: "Design",
};

export function isCategoryId(v: string): v is CategoryId {
  return (CATEGORY_IDS as readonly string[]).includes(v);
}

export type CollectionMeta = {
  id: string;
  title: string;
  description: string;
};

/** Curated shelves — ids match URL ?collection= */
export const COLLECTIONS: CollectionMeta[] = [
  { id: "featured", title: "Featured Books", description: "Hand-picked titles our readers love right now." },
  { id: "indian-languages", title: "Indian Languages", description: "Hindi, Tamil, Malayalam, and more — stories from every corner." },
  { id: "new-releases", title: "New Releases", description: "Fresh off the press — the latest additions to our catalog." },
  { id: "top-selling", title: "Top Selling Books", description: "Bestsellers and steady favorites flying off the shelf." },
  { id: "wfp", title: "WFP", description: "WritersDesk Publishing originals and partner highlights." },
  { id: "most-read", title: "Most Read", description: "Titles our community opens again and again." },
  { id: "editors-picks", title: "Editor's Picks", description: "What our editorial team is reading this season." },
  { id: "award-winners", title: "Award Winners", description: "Recognized excellence — prize lists and critical acclaim." },
];

export type CatalogBook = {
  id: string;
  title: string;
  author: string;
  cover: string;
  categories: CategoryId[];
  collections: string[];
};

export const CATALOG_BOOKS: CatalogBook[] = [
  {
    id: "b1",
    title: "Atomic Habits",
    author: "James Clear",
    cover: book1,
    categories: ["self-growth", "business"],
    collections: ["featured", "top-selling", "most-read", "wfp", "editors-picks"],
  },
  {
    id: "b2",
    title: "Deep Work",
    author: "Cal Newport",
    cover: book2,
    categories: ["business", "technology"],
    collections: ["featured", "top-selling", "most-read", "award-winners"],
  },
  {
    id: "b3",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    cover: book3,
    categories: ["finance", "self-growth"],
    collections: ["featured", "top-selling", "wfp"],
  },
  {
    id: "b4",
    title: "Build Don't Talk",
    author: "Raj Shamani",
    cover: book4,
    categories: ["business", "self-growth"],
    collections: ["featured", "indian-languages", "new-releases", "top-selling"],
  },
  {
    id: "b5",
    title: "The Alchemist",
    author: "Paulo Coelho",
    cover: book5,
    categories: ["fiction", "self-growth"],
    collections: ["featured", "most-read", "award-winners", "editors-picks"],
  },
  {
    id: "b6",
    title: "The Silent Waves",
    author: "Lily Morgan",
    cover: book6,
    categories: ["fiction", "design"],
    collections: ["new-releases", "wfp", "editors-picks"],
  },
  {
    id: "b7",
    title: "Ikigai",
    author: "Héctor García",
    cover: book1,
    categories: ["self-growth", "fiction"],
    collections: ["most-read", "top-selling", "indian-languages"],
  },
  {
    id: "b8",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    cover: book2,
    categories: ["technology", "business"],
    collections: ["top-selling", "award-winners", "most-read"],
  },
];

export function getCollectionMeta(id: string | undefined) {
  if (!id) return undefined;
  return COLLECTIONS.find((c) => c.id === id);
}

/** Books in a collection, or entire catalog when collection is undefined. */
export function booksInCollection(collectionId: string | undefined): CatalogBook[] {
  if (!collectionId) return [...CATALOG_BOOKS];
  return CATALOG_BOOKS.filter((b) => b.collections.includes(collectionId));
}

/**
 * Filter by category (OR). Empty selectedCategories → no extra filter (all books from current base).
 */
export function filterByCategories(books: CatalogBook[], selectedCategories: CategoryId[]): CatalogBook[] {
  if (selectedCategories.length === 0) return books;
  return books.filter((b) => b.categories.some((c) => selectedCategories.includes(c)));
}

export function booksForCollectionAndCategories(
  collectionId: string | undefined,
  selectedCategories: CategoryId[],
): CatalogBook[] {
  const base = booksInCollection(collectionId);
  return filterByCategories(base, selectedCategories);
}

export function previewBooksForCollection(collectionId: string, limit = 4): CatalogBook[] {
  return booksInCollection(collectionId).slice(0, limit);
}
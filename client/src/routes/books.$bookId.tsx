import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Calendar, Globe, Hash, Package, User } from "lucide-react";
import { useEffect, useState } from "react";
import { bookAPI } from "@/services/api";

const VITE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL || 'http://localhost:4000';

interface Category {
  _id: string;
  name: string;
}

interface Collection {
  _id: string;
  name: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  subject: string;
  description: string;
  cover: string;
  categories: Array<string | Category>;
  collections: Array<string | Collection>;
  identificationNumber?: string;
  publishDate?: string;
  publisher?: string;
  pages?: number;
  language?: string;
  status?: string;
}

export const Route = createFileRoute("/books/$bookId")({
  component: BookDetailsPage,
  head: (ctx) => ({
    meta: [{ title: `Book Details — ${ctx.params.bookId}` }],
  }),
});

function BookDetailsPage() {
  const { bookId } = Route.useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await bookAPI.getById(bookId);
        setBook(data);
      } catch (err) {
        console.error("Error fetching book:", err);
        setError("Unable to load this book.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const getCategoryNames = (categories: Array<string | Category>) =>
    categories.map((cat) => (typeof cat === "string" ? cat : cat.name)).filter(Boolean);

  const getCollectionNames = (collections: Array<string | Collection>) =>
    collections.map((col) => (typeof col === "string" ? col : col.name)).filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <p className="text-muted-foreground">Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 py-16">
        <p className="text-muted-foreground">{error || "Book not found."}</p>
        <button onClick={() => navigate(-1)} className="btn-outline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container-wide py-10 sm:py-14 md:py-16">
      {/* <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button> */}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(280px,360px)_1fr] items-start">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
            <img
              src={VITE_IMAGE_URL + book.cover}
              alt={book.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="card-soft p-5 sm:p-6">
            <h2 className="font-display text-xl sm:text-2xl">Book Information</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              {book.publisher && (
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-brand" />
                  <span>
                    <span className="font-medium text-foreground">Publisher:</span> {book.publisher}
                  </span>
                </div>
              )}
              {book.publishDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-brand" />
                  <span>
                    <span className="font-medium text-foreground">Published:</span> {new Date(book.publishDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {book.language && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-brand" />
                  <span>
                    <span className="font-medium text-foreground">Language:</span> {book.language}
                  </span>
                </div>
              )}
              {book.pages && (
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-brand" />
                  <span>
                    <span className="font-medium text-foreground">Pages:</span> {book.pages}
                  </span>
                </div>
              )}
              {book.identificationNumber && (
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-brand" />
                  <span>
                    <span className="font-medium text-foreground">ISBN:</span> {book.identificationNumber}
                  </span>
                </div>
              )}
              {book.subject && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-brand" />
                  <span>
                    <span className="font-medium text-foreground">Subject:</span> {book.subject}
                  </span>
                </div>
              )}
              {book.status && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                    {book.status === "active" ? "Available" : book.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[32px] border border-border bg-surface p-6 shadow-card backdrop-blur-xl">
            {/* <p className="text-sm uppercase tracking-[0.24em] text-brand">Book Details</p> */}
            <h1 className="mt-4 font-display text-3xl sm:text-4xl leading-tight">{book.title}</h1>
            <p className="mt-3 text-sm text-muted-foreground inline-flex items-center gap-2">
              <User className="h-4 w-4 text-brand" />
              {book.author}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {getCategoryNames(book.categories).map((category) => (
                <span key={category} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground">
                  {category}
                </span>
              ))}
            </div>

            <div className="mt-8 rounded-3xl bg-surface p-5">
              <h2 className="font-display text-lg">About this book</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{book.description || "No description available."}</p>
            </div>

            {getCollectionNames(book.collections).length > 0 && (
              <div className="rounded-3xl bg-surface p-5">
                <h2 className="font-display text-lg">Collections</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {getCollectionNames(book.collections).map((collection) => (
                    <span key={collection} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                      {collection}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="btn-primary w-full text-center">
                I&apos;m Interested
              </Link>
              <button onClick={() => navigate(-1)} className="btn-outline w-full text-center">
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Briefcase,
  Brush,
  DollarSign,
  Edit3,
  Heart,
  LayoutGrid,
  Library,
  Megaphone,
  Palette,
  PenLine,
  Phone,
  Quote,
  RefreshCw,
  Search,
  Sparkles,
  Sprout,
  Star,
  Users,
  Check,
} from "lucide-react";
import type { CategoryId } from "@/data/books-catalog";
import { booksInCollection, CATEGORY_LABELS } from "@/data/books-catalog";
import { categoryAPI, collectionAPI, bookAPI } from "@/services/api";
import heroBook from "@/assets/hero-book.png";
import sarah from "@/assets/avatar-sarah.jpg";

const VITE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL || 'http://localhost:4000'

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Veltrix — Discover Books That Inspire You" },
      {
        name: "description",
        content:
          "Browse curated categories, featured titles, and reader-loved picks. Explore books, send your interest, and we will help you find your next favorite read.",
      },
    ],
  }),
});

const howItWorksSteps = [
  {
    n: 1,
    icon: BookOpen,
    title: "Explore Books",
    desc: "Browse our collection and discover titles that match your interests.",
  },
  {
    n: 2,
    icon: PenLine,
    title: "Send Interest",
    desc: "Tap the button and share a few details so we know what you are looking for.",
  },
  {
    n: 3,
    icon: Phone,
    title: "We Connect",
    desc: "Our team reaches out with recommendations and next steps tailored to you.",
  },
];

// Fallback categories in case API fails
const fallbackCategories = [
  { icon: Brush, title: "Technology", hint: "Dev, AI, product", slug: "technology" },
  { icon: Briefcase, title: "Business", hint: "Leadership, strategy", slug: "business" },
  { icon: Sprout, title: "Self Growth", hint: "Habits, mindset", slug: "self-growth" },
  { icon: DollarSign, title: "Finance", hint: "Money, investing", slug: "finance" },
  { icon: Bookmark, title: "Fiction", hint: "Stories, classics", slug: "fiction" },
  { icon: Palette, title: "Design", hint: "UX, creativity", slug: "design" },
];

interface FetchedCategory {
  _id: string;
  name: string;
  description: string;
  icon?: string;
  ranking?: number;
}

interface CollectionItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  showHome: boolean;
  ranking?: number;
  bookCount?: number;
  previewCovers?: string[];
}

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
  cover: string;
  categories: Array<string | Category>;
  collections: Array<string | Collection>;
}

const whyChooseUs = [
  {
    icon: Library,
    title: "Curated Collection",
    desc: "Hand-picked titles so you spend less time searching and more time reading.",
  },
  {
    icon: LayoutGrid,
    title: "Wide Range",
    desc: "From tech and business to fiction and self-growth — something for every reader.",
  },
  {
    icon: Search,
    title: "Easy Discovery",
    desc: "Clear categories and featured picks make finding your next book effortless.",
  },
  {
    icon: Heart,
    title: "Reader Focused",
    desc: "Built around what readers want: quality summaries, interest flows, and support.",
  },
];

const stats = [
  { icon: BookOpen, value: "500+", label: "Books Available" },
  { icon: LayoutGrid, value: "20+", label: "Categories" },
  { icon: Users, value: "1K+", label: "Readers Interested" },
  { icon: RefreshCw, value: "Weekly", label: "Updated" },
];

type ReaderTestimonial = {
  name: string;
  role: string;
  quote: string;
} & ({ avatar: string; initials?: undefined } | { avatar?: undefined; initials: string });

const readerTestimonials: ReaderTestimonial[] = [
  {
    name: "Sarah Mitchell",
    role: "Product designer",
    quote: "I found three books I never would have picked on my own. The recommendations felt personal.",
    avatar: sarah,
  },
  {
    name: "Daniel Chen",
    role: "Startup founder",
    quote: "Sending interest was quick, and the follow-up was genuinely helpful. Great experience end to end.",
    initials: "DC",
  },
  {
    name: "Jordan Ellis",
    role: "Grad student",
    quote: "Love the categories and the featured section. I check back every week for new picks.",
    initials: "JE",
  },
];

const plans = [
  { name: "Basic", price: "$499", tag: "Perfect for first-time authors", features: ["Professional Editing", "eBook Publishing", "Standard Cover Design", "Global Distribution"], featured: false },
  { name: "Pro", price: "$799", tag: "Everything you need to succeed", features: ["Everything in Basic", "Print & eBook Publishing", "Premium Cover Design", "Marketing Support"], featured: true },
  { name: "Premium", price: "$1299", tag: "For authors who want the best", features: ["Everything in Pro", "Audiobook Publishing", "Advanced Marketing", "Priority Support"], featured: false },
];

function HomePage() {
  const [categories, setCategories] = useState<FetchedCategory[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const featuredCollections = collections.filter(c => c.showHome); // limit to 10 or something

  const featuredCollection = collections.find(c => c.slug === 'featured');
  const mostReadCollection = collections.find(c => c.slug === 'most-read');

  const featuredBooks = books.filter(b => 
    b.collections.some(col => (typeof col === 'string' ? col : col._id) === featuredCollection?._id)
  ).slice(0, 5);

  const mostReadBooks = books.filter(b => 
    b.collections.some(col => (typeof col === 'string' ? col : col._id) === mostReadCollection?._id)
  ).slice(0, 5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, collectionsData, booksData] = await Promise.all([
          categoryAPI.getAll(),
          collectionAPI.getAll(),
          bookAPI.getAll(),
        ]);
        const categoriesList: FetchedCategory[] = Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || [];
        categoriesList.sort((a, b) => (a.ranking ?? 0) - (b.ranking ?? 0));
        const collectionsList: CollectionItem[] = Array.isArray(collectionsData) ? [...collectionsData] : [];
        collectionsList.sort((a, b) => (a.ranking ?? 0) - (b.ranking ?? 0));
        setCategories(categoriesList);
        setCollections(collectionsList);
        setBooks(booksData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setCategories([]);
        setCollections([]);
        setBooks([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-110 transition-all duration-700"
            style={{
              backgroundImage: "var(--hero-bg-image)",
              filter: "var(--hero-blur)",
            }}
          />
          <div
            className="absolute inset-0 transition-colors duration-700"
            style={{ background: "var(--hero-overlay)" }}
          />
        </div>
        <div className="container-wide pt-20 pb-14 sm:pt-24 sm:pb-20 md:pt-28 md:pb-24 lg:pt-30 lg:pb-28 grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div className="text-center lg:text-left min-w-0">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-[11px] tracking-[0.22em] font-semibold uppercase text-brand px-3 py-1.5 rounded-full border border-[color-mix(in_oklab,var(--brand)_90%,transparent)]"
            >
              Discover your next read
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-5 sm:mt-6 font-display text-[clamp(2rem,8.5vw,4.75rem)] md:text-[clamp(2.5rem,5.6vw,4.75rem)] leading-[1.06] tracking-tight balance break-words"
            >
              Discover Books
              <br />
              That <span className="gradient-brand-text">Inspire You</span>
            </motion.h1>
            <p className="mt-5 sm:mt-6 text-[15px] md:text-base text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed">
              Explore curated categories, featured titles, and reader-loved picks. Find stories and ideas that stick with you — no clutter, just great books.
            </p>
            <div className="mt-7 sm:mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link to="/books" className="btn-primary">
                Explore Books <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="btn-outline">
                Send Interest <Phone className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={sarah}
                    alt=""
                    className="h-9 w-9 rounded-full border-2 border-background object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-[var(--warning)]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">4.9/5 from 1K+ readers</p>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative h-[min(68vw,320px)] sm:h-[380px] md:h-[460px] lg:h-[540px] flex items-center justify-center mt-4 lg:mt-0">
            <div className="absolute inset-0 grid place-items-center -z-10 pointer-events-none scale-[0.72] sm:scale-90 md:scale-100 origin-center">
              <div
                className="absolute h-[min(92vw,420px)] w-[min(92vw,420px)] md:h-[600px] md:w-[600px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in oklab, var(--brand) 12%, transparent) 0%, transparent 70%)",
                }}
              />
              <div
                className="relative h-[min(78vw,340px)] w-[min(78vw,340px)] md:h-[460px] md:w-[460px] rounded-full border border-[var(--brand)]/20 shadow-[0_0_100px_rgba(207,130,230,0.15)]"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in oklab, var(--brand) 8%, transparent) 0%, transparent 60%)",
                }}
              />
            </div>
            <img
              src={heroBook}
              alt="Featured book cover"
              className="relative z-10 max-h-full w-auto max-w-[min(100%,280px)] sm:max-w-[min(100%,360px)] md:max-w-none h-full object-contain drop-shadow-[0_20px_50px_rgba(207,130,230,0.6)]"
              width={896}
              height={1024}
            />
            <FloatTag className="hidden sm:flex top-15 left-2 md:left-8" icon={Sparkles} label="Featured" />
            <FloatTag className="hidden sm:flex top-24 right-0" icon={BookOpen} label="Bestsellers" />
            <FloatTag className="hidden sm:flex bottom-28 left-2" icon={Library} label="Curated" />
            <FloatTag className="hidden sm:flex bottom-6 right-6" icon={Megaphone} label="New picks" />
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-8 py-4 sm:py-6">
        <div className="bg-section-group px-2.5 sm:px-3 md:px-4">
          {/* STATS */}
          <div className="mt-6 sm:mt-10 card-soft p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 min-w-0">
                <div
                  className="h-12 w-12 grid place-items-center rounded-xl"
                  style={{ background: "color-mix(in oklab, var(--brand) 15%, transparent)" }}
                >
                  <s.icon className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <div className="font-display text-xl sm:text-2xl">{s.value}</div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground leading-snug">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* EXPLORE CATEGORIES */}
          <section id="explore-categories" className="container-wide py-12 sm:py-16 md:py-20 scroll-mt-24">
            <div className="text-center max-w-2xl mx-auto px-1">
              {/* <span className="eyebrow">Explore</span> */}
              <h2 className="mt-3 font-display text-[clamp(1.5rem,5vw,2.6rem)] balance">Explore Categories</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Discover books by your areas of interest — from technology and business to fiction and design.{" "}
                <Link to="/collections" className="text-brand font-medium hover:underline">
                  Browse all collections
                </Link>
              </p>
            </div>
            <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-6">
              {categoriesLoading ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No categories available</p>
                </div>
              ) : (
                categories.map((c, i) => (
                  <motion.div
                    key={c._id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="group flex min-h-[168px] sm:min-h-[188px] lg:min-h-[220px] flex-col rounded-xl border border-white/[0.06] bg-[#232938] p-3.5 sm:p-4 md:p-5 transition-colors hover:border-[#7C5CFF]/35"
                  >
                    <div className="h-11 w-11 shrink-0 grid place-items-center rounded-lg bg-[#7C5CFF]/18">
                      {c.icon ? (
                        <img
                          src={`${VITE_IMAGE_URL}/${c.icon}`}
                          alt={c.name}
                          className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                        />
                      ) : (
                        <Brush className="h-5 w-5 sm:h-6 sm:w-6 text-[#7C5CFF]" strokeWidth={1.75} />
                      )}
                    </div>
                    <h3 className="mt-3 sm:mt-4 font-display text-sm sm:text-[15px] md:text-base leading-tight">{c.name}</h3>
                    <p className="mt-1 sm:mt-1.5 text-[10px] sm:text-[11px] md:text-xs text-[#A0AEC0] leading-snug line-clamp-2">{c.description}</p>
                    <div className="mt-auto pt-3">
                      <Link
                        to="/books"
                        search={{ categories: c._id }}
                        className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#7C5CFF] group-hover:gap-2 transition-all"
                      >
                        Explore <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* FEATURED BOOKS */}
          {/* <section id="books" className="container-wide py-10 sm:py-12 scroll-mt-24 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-center sm:text-left min-w-0">
              <div className="min-w-0">
                <h2 className="mt-3 font-display text-[clamp(1.5rem,5vw,2.6rem)] balance">Featured Books</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                  Start with our highlighted titles — tap interest on any book and we will follow up with details.
                </p>
              </div>
              {featuredCollection && (
                <Link to="/books" search={{ collection: featuredCollection._id }} className="btn-outline !h-10 !px-4 shrink-0 self-center sm:self-auto">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
            <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {featuredBooks.map((b) => (
                <div key={b._id} className="group flex flex-col min-w-0">
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
                    <Link to="/contact" className="mt-3 w-full text-center btn-outline !h-9 !text-xs py-0">
                      I&apos;m Interested
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section> */}

          {/* MOST READ */}
          {/* <section id="most-read" className="container-wide py-10 sm:py-12 scroll-mt-24 border-t border-border/60 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-center sm:text-left min-w-0">
              <div className="min-w-0">
                <h2 className="mt-3 font-display text-[clamp(1.5rem,5vw,2.6rem)] balance">Most Read Books</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                  Titles readers return to most often — open the full shelf to browse with category filters.
                </p>
              </div>
              {mostReadCollection && (
                <Link to="/books" search={{ collection: mostReadCollection._id }} className="btn-outline !h-10 !px-4 shrink-0 self-center sm:self-auto">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
            <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {mostReadBooks.map((b) => (
                <div key={b._id} className="group flex flex-col min-w-0">
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
                    <Link
                      to="/contact"
                      className="mt-3 w-full text-center btn-outline !h-9 !text-xs py-0"
                    >
                      I&apos;m Interested
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section> */}

          {/* FEATURED COLLECTIONS */}
          {featuredCollections.map((collection, index) => {
            const collectionBooks = books.filter(b => 
              b.collections.some(col => (typeof col === 'string' ? col : col._id) === collection._id)
            ).slice(0, 5); // limit to 5 books per collection

            return (
              <section key={collection._id} id={`collection-${collection.slug}`} className="container-wide py-10 sm:py-12 scroll-mt-24 border-t border-border/60 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-center sm:text-left min-w-0">
                  <div className="min-w-0">
                    <h2 className="mt-3 font-display text-[clamp(1.5rem,5vw,2.6rem)] balance">{collection.name}</h2>
                    <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                      {collection.description || 'Explore books in this curated collection.'}
                    </p>
                  </div>
                  <Link to="/books" search={{ collection: collection._id }} className="btn-outline !h-10 !px-4 shrink-0 self-center sm:self-auto">
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                {collectionBooks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-16">No books in this collection yet.</p>
                ) : (
                  <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {collectionBooks.map((b) => (
                      <div key={b._id} className="group flex flex-col min-w-0">
                        <div className="relative overflow-hidden rounded-lg border border-border aspect-[2/3] bg-surface">
                          <img
                            src={VITE_IMAGE_URL+ b.cover}
                            alt={b.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="mt-3 flex-1 flex flex-col">
                          <p className="font-display text-[13px] sm:text-sm leading-snug line-clamp-2">{b.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{b.author}</p>
                          <Link to="/contact" className="mt-3 w-full text-center btn-outline !h-9 !text-xs py-0">
                            I&apos;m Interested
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}

          {/* WHY CHOOSE US */}
          <section className="container-wide py-12 sm:py-16 min-w-0">
            <div className="text-center max-w-2xl mx-auto px-1">
              <h2 className="mt-3 font-display text-[clamp(1.5rem,5vw,2.6rem)] balance">Why Choose Us?</h2>
            </div>
            <div className="mt-10 sm:mt-12 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {whyChooseUs.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="card-soft p-5 sm:p-6 text-center"
                >
                  <div className="mx-auto h-12 w-12 grid place-items-center rounded-xl bg-[color-mix(in_oklab,var(--brand)_12%,transparent)]">
                    <item.icon className="h-6 w-6 text-brand" />
                  </div>
                  <h3 className="mt-4 font-display text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="container-wide py-12 sm:py-16 md:py-20 min-w-0">
            <div className="text-center max-w-2xl mx-auto px-1">
              <h2 className="mt-3 font-display text-[clamp(1.5rem,5vw,2.6rem)] balance">How It Works?</h2>
              <p className="mt-3 text-sm text-muted-foreground">Simple steps to connect with us.</p>
            </div>
            <div className="mt-10 sm:mt-12 grid gap-5 sm:gap-6 md:grid-cols-3 relative">
              {howItWorksSteps.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-soft p-5 sm:p-6 text-center relative"
                >
                  <div
                    className="mx-auto mb-4 h-11 w-11 rounded-full grid place-items-center text-sm font-display font-semibold text-brand-foreground border border-white/10"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    {s.n}
                  </div>
                  <div className="mx-auto h-12 w-12 grid place-items-center rounded-xl">
                    <s.icon className="h-9 w-9 text-brand" />
                  </div>
                  <h3 className="mt-4 font-display text-lg">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* TESTIMONIALS + PRICING */}
          <section className="container-wide py-12 sm:py-16 min-w-0">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 px-1">
              <h2 className="mt-3 font-display text-[clamp(1.5rem,5vw,2.6rem)] balance">What Readers Say</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mb-12 sm:mb-16">
              {readerTestimonials.map((t) => (
                <div key={t.name} className="card-soft p-5 sm:p-6 flex flex-col min-w-0">
                  <div className="flex items-start gap-3">
                    {"avatar" in t && t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="h-12 w-12 rounded-full object-cover shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="h-12 w-12 rounded-full grid place-items-center text-sm font-semibold text-brand-foreground shrink-0"
                        style={{ background: "var(--gradient-brand)" }}
                      >
                        {"initials" in t ? t.initials : ""}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-display text-sm font-semibold">{t.name}</p>
                      <p className="text-[11px] text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <Quote className="h-4 w-4 text-brand mt-4 mb-2 opacity-80" />
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{t.quote}</p>
                  <div className="mt-4 flex gap-0.5 text-[var(--warning)]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="text-center">
                <span className="eyebrow">Pricing Plans</span>
                <h3 className="mt-3 font-display text-2xl">Affordable Plans for Every Author</h3>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {plans.map((p) => (
                  <div
                    key={p.name}
                    className={`card-soft p-4 sm:p-5 relative min-w-0 ${p.featured ? "ring-2 ring-[var(--brand)]" : ""}`}
                  >
                    {p.featured && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] tracking-widest bg-brand px-2.5 py-0.5 rounded-full font-semibold whitespace-nowrap">
                        MOST POPULAR
                      </span>
                    )}
                    <h4 className="font-display text-lg">{p.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.tag}</p>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="font-display text-2xl">{p.price}</span>
                      <span className="text-[10px] text-muted-foreground">One-time</span>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-xs">
                          <Check className="h-3.5 w-3.5 text-brand shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <Link to="/contact" className={`mt-5 w-full text-xs ${p.featured ? "btn-primary" : "btn-outline"} !h-9`}>
                      Choose Plan
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* CTA STRIP */}
      <section className="container-wide pb-12 sm:pb-16 px-1 sm:px-0">
        <div className="card-soft p-5 sm:p-8 md:p-10 text-center max-w-3xl mx-auto">
          <h3 className="font-display text-[clamp(1.2rem,4.5vw,1.85rem)] balance">
            Ready to discover your next favorite book?
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Jump into featured picks or browse the full library — we are here when you want to go deeper.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5 sm:gap-3">
            <Link to="/books" className="btn-primary">
              Explore Books <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn-outline">
              Send Interest <Phone className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function FloatTag({ className, icon: Icon, label }: { className?: string; icon: typeof Edit3; label: string }) {
  return (
    <div className={`absolute z-20 ${className ?? ""}`}>
      <div className="card-soft px-3 py-2 flex flex-col items-center gap-2 backdrop-blur-md bg-background/70">
        <Icon className="h-3.5 w-3.5 text-brand" />
        <span className="text-xs font-medium">{label}</span>
      </div>
    </div>
  );
}

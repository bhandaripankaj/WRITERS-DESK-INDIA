import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/how-it-works")({
  component: Page,
  head: () => ({ meta: [{ title: "How It Works — WritersDesk Publishing" }] }),
});

const steps = [
  { n: "01", title: "Upload Manuscript", desc: "Submit your manuscript and tell us about your book." },
  { n: "02", title: "We Edit & Design", desc: "Our experts edit your book and design a stunning cover." },
  { n: "03", title: "Publish Globally", desc: "We publish and distribute your book to leading platforms." },
  { n: "04", title: "Start Selling", desc: "Reach readers worldwide and earn your royalties." },
];

function Page() {
  return (
    <>
      <PageHero eyebrow="How It Works" title={<>From manuscript to <span className="gradient-brand-text">published book</span></>} description="A simple, proven four-step process designed to take the stress out of publishing." />
      <section className="container-wide py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="card-soft p-7">
              <div className="text-brand text-xs font-semibold tracking-widest">{s.n}</div>
              <h3 className="mt-3 font-display text-xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

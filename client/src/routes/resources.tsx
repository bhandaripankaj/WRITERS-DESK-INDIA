import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/resources")({
  component: Page,
  head: () => ({ meta: [{ title: "Resources — WritersDesk Publishing" }] }),
});

const items = [
  { title: "Blog", desc: "Articles on writing, editing, publishing and marketing." },
  { title: "Guides", desc: "Long-form guides to help you publish like a pro." },
  { title: "Writing Tips", desc: "Practical tips to sharpen your craft." },
  { title: "Success Stories", desc: "Real authors who built real careers." },
  { title: "FAQs", desc: "Answers to common publishing questions." },
];

function Page() {
  return (
    <>
      <PageHero eyebrow="Resources" title={<>Learn, write, <span className="gradient-brand-text">publish smarter</span></>} description="Curated resources for first-time authors and seasoned writers alike." />
      <section className="container-wide py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <div key={i.title} className="card-soft p-7">
              <h3 className="font-display text-xl">{i.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{i.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

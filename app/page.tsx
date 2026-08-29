import Link from "next/link";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://fieldflow.demo.sageobot.com"
).replace(/\/$/, "");

const SITE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "FieldFlow",
      url: SITE_URL,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "FieldFlow",
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

const FEATURES = [
  {
    title: "Job scheduling",
    text: "Plan every job on a drag-and-drop weekly board. See who is where, and what is still unassigned.",
  },
  {
    title: "Technician app",
    text: "Your crew gets the day's route, job details, and checklists on their phone. No more morning phone calls.",
  },
  {
    title: "Automated customer notifications",
    text: "Customers get a confirmation, an arrival window, and an on-my-way text without anyone typing a message.",
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(SITE_SCHEMA).replace(/</g, "\\u003c"),
        }}
      />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <section className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            FieldFlow: scheduling and dispatch software for field-service teams.
          </h1>
          <p className="text-xl text-gray-600">
            Stop planning your week on a whiteboard.
          </p>
        </section>

        <section className="mb-16 grid gap-8 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title}>
              <h2 className="text-base font-semibold mb-2">{feature.title}</h2>
              <p className="text-sm text-gray-600">{feature.text}</p>
            </div>
          ))}
        </section>

        <section className="mb-16 border-t border-gray-200 pt-8">
          <h2 className="text-base font-semibold mb-2">
            Built around field-service work
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl">
            Owners and operations teams at HVAC, plumbing, electrical,
            cleaning, and landscaping businesses can plan jobs, coordinate
            technicians, and automate routine customer updates in one simple
            workflow.
          </p>
        </section>

        <section className="border-t border-gray-200 pt-8 text-sm text-gray-500">
          <p>
            Built in Berlin, used by 200+ trade businesses.{" "}
            <Link href="/blog" className="text-blue-600 hover:underline">
              Read our blog
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Technician App for Field-Service Teams | FieldFlow",
  description:
    "Give technicians their daily route, job details, and checklists on their phone with FieldFlow's app for field-service teams.",
  alternates: { canonical: "/technician-app" },
};

const MOBILE_FEATURES = [
  {
    title: "The day's route",
    text: "Give your crew a clear view of where they need to go throughout the day.",
  },
  {
    title: "Job details",
    text: "Put the information for each job on the technician's phone, ready for the next visit.",
  },
  {
    title: "Phone-based checklists",
    text: "Keep the steps for each job together in a checklist your crew can open in the field.",
  },
];

const WORKFLOW = [
  {
    step: "1",
    title: "Plan the week",
    text: "Schedule every job on the drag-and-drop weekly board and see what is still unassigned.",
  },
  {
    step: "2",
    title: "Send the crew out prepared",
    text: "Technicians open their route, job details, and checklists on their phone.",
  },
  {
    step: "3",
    title: "Keep customers informed",
    text: "Use confirmations, arrival windows, and on-my-way texts without typing every message.",
  },
];

export default function TechnicianAppPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <section className="mb-16 max-w-3xl">
        <p className="text-sm font-semibold text-blue-600 mb-4">
          Technician app
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Give every technician a clear plan for the day.
        </h1>
        <p className="text-xl text-gray-600">
          FieldFlow puts the day&apos;s route, job details, and checklists on
          your crew&apos;s phones. Keep field work moving without the morning
          phone calls.
        </p>
      </section>

      <section className="mb-16 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-semibold mb-8">
          The details your crew needs in the field
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {MOBILE_FEATURES.map((feature) => (
            <div key={feature.title}>
              <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-semibold mb-3">
          One simple field-service workflow
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Connect the weekly plan, the technician&apos;s day, and routine
          customer updates without adding enterprise complexity.
        </p>
        <div className="grid gap-8 sm:grid-cols-3">
          {WORKFLOW.map((item) => (
            <div key={item.step} className="border-t border-gray-200 pt-4">
              <p className="text-sm font-semibold text-gray-400 mb-2">
                {item.step}
              </p>
              <h3 className="text-base font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16 border-t border-gray-200 pt-8 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-3">
          Less morning coordination, more clarity in the field
        </h2>
        <div className="space-y-4 text-gray-600">
          <p>
            A whiteboard can show the plan in the office, but it does not
            travel with the crew. When technicians need to call for every
            route, job detail, or checklist, the day starts with more admin
            than it should.
          </p>
          <p>
            FieldFlow keeps the weekly job board and the technician&apos;s day in
            one simple workflow. The office can see where jobs sit and what is
            still unassigned, while each technician has the route and job
            information for the day on their phone.
          </p>
        </div>
      </section>

      <section className="mb-16 border-t border-gray-200 pt-8 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-3">
          Built for teams with 5 to 50 technicians
        </h2>
        <p className="text-gray-600">
          FieldFlow is made for owners, operations managers, service managers,
          dispatchers, and office admins at HVAC, plumbing, electrical,
          cleaning, and landscaping businesses.
        </p>
      </section>

      <section className="border-t border-gray-200 pt-8 text-sm">
        <Link href="/" className="text-blue-600 hover:underline">
          Explore FieldFlow scheduling and dispatch
        </Link>
      </section>
    </main>
  );
}

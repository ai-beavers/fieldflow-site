import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://fieldflow.demo.sageobot.com"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Dispatch Management Software | FieldFlow",
  description:
    "Plan jobs, coordinate technicians, and keep customers informed with simple dispatch management software for field-service teams of 5 to 50.",
  alternates: { canonical: `${SITE_URL}/dispatch-management` },
};

const WORKFLOW = [
  {
    title: "Plan the week in one place",
    text: "Move jobs around a drag-and-drop weekly board instead of rebuilding the schedule on a whiteboard. See which technician has each job and which work still needs an owner.",
  },
  {
    title: "Give technicians the details they need",
    text: "Each technician gets the day’s route, job details, and checklists on their phone. The office can coordinate the day without repeating the plan in morning phone calls.",
  },
  {
    title: "Keep customers informed",
    text: "Send a confirmation, an arrival window, and an on-my-way text as part of the same workflow. Your team spends less time typing routine updates for every job.",
  },
];

export default function DispatchManagementPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <section className="mb-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
          Dispatch management software
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Dispatch management without the morning scramble.
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          FieldFlow gives field-service teams a simple way to plan jobs, coordinate
          technicians, and keep customers updated from one connected workflow.
        </p>
      </section>

      <section className="mb-16" aria-labelledby="workflow-heading">
        <h2 id="workflow-heading" className="text-2xl font-bold tracking-tight mb-8">
          From weekly plan to completed visit
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {WORKFLOW.map((step) => (
            <div key={step.title}>
              <h3 className="text-base font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Built for small field-service operations
        </h2>
        <div className="space-y-4 text-gray-600 max-w-3xl">
          <p>
            FieldFlow is designed for owners, operations managers, service managers,
            dispatchers, and office admins coordinating teams of 5 to 50 technicians.
            It supports the day-to-day scheduling work of HVAC, plumbing, electrical,
            cleaning, and landscaping businesses.
          </p>
          <p>
            The focus is a clear, English-first workflow without enterprise complexity.
            Your office can see what is assigned, what is still unassigned, and what the
            field team needs for the day.
          </p>
        </div>
      </section>

      <section className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Replace disconnected dispatch steps
        </h2>
        <p className="text-gray-600 max-w-3xl mb-4">
          A weekly board, technician details, and customer notifications work together
          so the schedule is easier to follow from the office to the job site.
        </p>
        <p className="text-gray-600 max-w-3xl mb-4">
          Dispatchers and office admins can lay out the week, see who has each job, and
          spot work that is still unassigned. Technicians can refer to their route, job
          details, and checklist on their phone, while customers receive the confirmation
          and arrival information connected to the visit. The same plan stays clear from
          the office to the field.
        </p>
        <Link href="/" className="text-blue-600 hover:underline">
          See the FieldFlow overview
        </Link>
      </section>
    </main>
  );
}

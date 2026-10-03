import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://fieldflow.demo.sageobot.com"
).replace(/\/$/, "");
const PAGE_URL = `${SITE_URL}/customer-notifications`;

export const metadata: Metadata = {
  title: "Automated Customer Notifications for Field Service | FieldFlow",
  description:
    "Send confirmations, arrival windows, and on-my-way texts without typing every message. Keep field-service customers informed with FieldFlow.",
  alternates: { canonical: PAGE_URL },
};

const NOTIFICATIONS = [
  {
    title: "Confirmation",
    text: "Give customers a clear confirmation for the scheduled visit.",
  },
  {
    title: "Arrival window",
    text: "Share a practical window for when the technician is expected.",
  },
  {
    title: "On-my-way text",
    text: "Let customers know when the technician is on the way.",
  },
];

export default function CustomerNotificationsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <section className="mb-16">
        <p className="text-sm font-semibold text-gray-500 mb-4">
          Automated customer notifications
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Keep customers informed without typing every message.
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          FieldFlow sends a confirmation, an arrival window, and an on-my-way
          text as part of a simple scheduling and dispatch workflow for
          field-service teams.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Three useful updates, handled automatically
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {NOTIFICATIONS.map((notification) => (
            <div key={notification.title} className="border-t border-gray-200 pt-4">
              <h3 className="text-base font-semibold mb-2">
                {notification.title}
              </h3>
              <p className="text-sm text-gray-600">{notification.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Less routine messaging for the office
          </h2>
          <p className="text-gray-600 mb-4">
            Dispatchers and office admins already have jobs to plan,
            technicians to coordinate, and unassigned work to watch. FieldFlow
            handles standard customer updates without anyone typing a message
            each time.
          </p>
          <p className="text-gray-600">
            Customers get the practical details they need, while the office can
            stay focused on the schedule and the changes that need a person.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            One workflow from office to field
          </h2>
          <ol className="space-y-4 text-gray-600">
            <li>
              <span className="font-semibold text-gray-900">1. Plan the work.</span>{" "}
              Use the drag-and-drop weekly board to see assigned and unassigned
              jobs.
            </li>
            <li>
              <span className="font-semibold text-gray-900">2. Equip the crew.</span>{" "}
              Technicians get their route, job details, and checklists on their
              phone.
            </li>
            <li>
              <span className="font-semibold text-gray-900">
                3. Update the customer.
              </span>{" "}
              Send the confirmation, arrival window, and on-my-way text without
              a separate round of manual messages.
            </li>
          </ol>
        </div>
      </section>

      <section className="mb-16 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Built for busy field-service teams
        </h2>
        <p className="text-gray-600 max-w-3xl">
          FieldFlow is designed for businesses with 5 to 50 technicians,
          including HVAC, plumbing, electrical, cleaning, and landscaping
          teams. It gives owners, operations managers, service managers,
          dispatchers, and office admins a simple way to coordinate jobs and
          customer communication without enterprise complexity.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Customer notification questions
        </h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-base font-semibold mb-2">
              What updates does FieldFlow send?
            </h3>
            <p className="text-gray-600">
              Customers receive a confirmation, an arrival window, and an
              on-my-way text. These cover the key moments before a technician
              arrives.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-2">
              Does the office need to type each message?
            </h3>
            <p className="text-gray-600">
              No. The standard updates are automated, so routine messages do
              not add another manual task to the day.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-2">
              How do notifications fit with scheduling?
            </h3>
            <p className="text-gray-600">
              FieldFlow brings job planning, technician information, and
              customer updates into one straightforward field-service
              workflow.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 pt-8 text-sm text-gray-500">
        <p>
          See how customer updates fit into the full scheduling workflow.{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            Explore FieldFlow
          </Link>
        </p>
      </section>
    </main>
  );
}

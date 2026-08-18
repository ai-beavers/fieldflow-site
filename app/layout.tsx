import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FieldFlow: scheduling and dispatch software for field-service teams",
  description:
    "FieldFlow helps field-service teams plan jobs, dispatch technicians, and keep customers informed. Stop planning your week on a whiteboard.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

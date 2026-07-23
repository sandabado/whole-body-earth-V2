import type { Metadata } from "next";
import { EventsExplorer } from "../components/EventsExplorer";

export const metadata: Metadata = {
  title: "Events",
  description: "Readings, launches, workshops, signings, and discussions from Whole Body Press.",
};

export default function EventsPage() {
  return (
    <div className="page press-page">
      <header className="press-page-hero">
        <p className="eyebrow">READINGS · LAUNCHES · WORKSHOPS</p>
        <h1>Meet us at<br />the living page.</h1>
        <p>Small rooms, open sky, honest conversation. Gather with the authors and practices behind each edition.</p>
      </header>
      <section className="press-section press-section--first">
        <EventsExplorer />
      </section>
    </div>
  );
}

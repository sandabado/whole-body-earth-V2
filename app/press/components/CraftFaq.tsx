"use client";

import { useState } from "react";

const questions = [
  {
    question: "Why acid-free paper?",
    answer: "Acid-free paper has a neutral or alkaline pH, so it avoids the rapid yellowing and brittleness associated with acidic stock. Every planned Press print edition specifies paper selected for long use and stable storage.",
  },
  {
    question: "What is the difference between perfect binding and Smyth-sewn?",
    answer: "Perfect binding adheres individual pages at the spine and keeps trade editions affordable. Smyth-sewing stitches folded signatures together before casing, allowing a book to open more naturally and withstand repeated use. Hand-bound editions may use exposed Coptic stitching.",
  },
  {
    question: "Can I refill a hand-bound edition?",
    answer: "Refillability depends on the final commissioned structure. Press intends to offer replaceable text blocks for selected cloth and leather editions; the catalog will identify any edition that is explicitly refillable.",
  },
  {
    question: "What is the Bookbinders stamp?",
    answer: "When a production partner makes an edition, its maker should be credited on the object. The proposed Stockholm editions include the craftsperson or workshop mark on the inside back cover alongside the Press colophon.",
  },
  {
    question: "Can I visit the workshop?",
    answer: "Bookbinders Design operates retail locations in Sweden. Production access is not assumed or included with a Press purchase. If a formal workshop program becomes available, Press will publish the details here.",
  },
  {
    question: "Do you offer audiobooks?",
    answer: "Not yet. Voice is treated as a separate medium from the page. When Press produces audio editions, they will be recorded with human narrators and the same editorial care as the printed work.",
  },
] as const;

export function CraftFaq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="craft-faq">
      {questions.map((item, index) => (
        <article key={item.question} className={open === index ? "open" : ""}>
          <h3>
            <button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.question}
              <i>{open === index ? "−" : "+"}</i>
            </button>
          </h3>
          {open === index && <p>{item.answer}</p>}
        </article>
      ))}
    </div>
  );
}

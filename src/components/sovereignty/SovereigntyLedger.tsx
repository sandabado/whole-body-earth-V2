"use client";

import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { DataProvenanceBadge } from "@/components/DataProvenanceBadge";
import { GuildEconomyPanel } from "@/components/sovereignty/GuildEconomyPanel";
import { DATA_PROVENANCE } from "@/lib/data-provenance";
import { HOUSE_ROMAN, HOUSE_SPECTRUM, HOUSE_SPECTRUM_ORDER } from "@/lib/house-spectrum";
import {
  buildSovereigntySuggestion,
  isSovereigntyEntry,
  SOVEREIGNTY_METRIC_LABELS,
  SOVEREIGNTY_PILLARS,
  SOVEREIGNTY_STORAGE_KEY,
  summarizeSovereigntyEntries,
  type SovereigntyEntry,
  type SovereigntyMetric,
} from "@/lib/sovereignty";
import { HOUSE_DEFINITIONS, type HouseNumber } from "@/types/houses";

type LedgerStyle = CSSProperties & { "--house-color"?: string };
type LedgerPeriod = 7 | 30 | 365;

const QUICK_TAGS: Array<{ label: string; house: HouseNumber }> = [
  { label: "Built a system", house: 3 },
  { label: "Made music", house: 5 },
  { label: "Published something", house: 6 },
  { label: "Collaborated", house: 8 },
  { label: "Documented knowledge", house: 9 },
  { label: "Planned the future", house: 11 },
];

function startDateFor(today: string, days: LedgerPeriod): string {
  if (!today) return "0000-00-00";
  const date = new Date(`${today}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - (days - 1));
  return date.toISOString().slice(0, 10);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMinutes(value: number): string {
  if (value < 60) return `${value}m`;
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

export function SovereigntyLedger() {
  const [entries, setEntries] = useState<SovereigntyEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [today, setToday] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedHouse, setSelectedHouse] = useState<HouseNumber>(1);
  const [metric, setMetric] = useState<SovereigntyMetric>("action");
  const [value, setValue] = useState("");
  const [period, setPeriod] = useState<LedgerPeriod>(7);
  const [notice, setNotice] = useState("Nothing leaves this browser.");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const currentDate = new Date().toISOString().slice(0, 10);
      setToday(currentDate);
      setDate(currentDate);
      try {
        const stored = window.localStorage.getItem(SOVEREIGNTY_STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (Array.isArray(parsed)) setEntries(parsed.filter(isSovereigntyEntry));
        }
      } catch {
        setNotice("The local ledger could not be read. New entries can still be recorded.");
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(SOVEREIGNTY_STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // The visible notice from the write action explains storage failure.
    }
  }, [entries, hydrated]);

  const summaries = useMemo(
    () => summarizeSovereigntyEntries(entries, startDateFor(today, period)),
    [entries, period, today],
  );
  const suggestion = useMemo(() => buildSovereigntySuggestion(summaries), [summaries]);
  const selectedSummary = summaries[selectedHouse];
  const selectedDefinition = HOUSE_DEFINITIONS[selectedHouse];
  const selectedPillar = SOVEREIGNTY_PILLARS[selectedHouse];
  const periodEntries = Object.values(summaries).reduce((sum, summary) => sum + summary.actions, 0);
  const totalMinutes = Object.values(summaries).reduce((sum, summary) => sum + summary.minutes, 0);
  const totalSpend = Object.values(summaries).reduce((sum, summary) => sum + summary.spend, 0);
  const totalRevenue = Object.values(summaries).reduce((sum, summary) => sum + summary.revenue, 0);

  function addEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanDescription = description.trim();
    const numericValue = metric === "action" ? 1 : Number(value);
    if (!cleanDescription || !date || !Number.isFinite(numericValue) || numericValue <= 0) {
      setNotice("Add a description, date, and positive metric value.");
      return;
    }
    const entry: SovereigntyEntry = {
      id: crypto.randomUUID(),
      date,
      house: selectedHouse,
      description: cleanDescription,
      metric,
      value: numericValue,
      createdAt: new Date().toISOString(),
    };
    try {
      const nextEntries = [entry, ...entries];
      window.localStorage.setItem(SOVEREIGNTY_STORAGE_KEY, JSON.stringify(nextEntries));
      setEntries(nextEntries);
      setDescription("");
      setValue("");
      setMetric("action");
      setNotice(`Logged locally to House ${HOUSE_ROMAN[selectedHouse]} / ${selectedDefinition.name}.`);
    } catch {
      setNotice("This browser blocked local storage, so the entry was not saved.");
    }
  }

  function removeEntry(id: string) {
    setEntries((current) => current.filter((entry) => entry.id !== id));
    setNotice("Entry removed from this browser.");
  }

  function exportLedger() {
    const payload = JSON.stringify({
      exportedAt: new Date().toISOString(),
      schema: "dodecanic-sovereignty-ledger-v1",
      authority: "YOU / Ø",
      entries,
    }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `dodecanic-sovereignty-${today || "export"}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("A JSON copy of your local ledger was exported.");
  }

  return (
    <section className="sovereignty-ledger" aria-label="Personal sovereignty activity ledger">
      <header className="sovereignty-header">
        <div>
          <p className="eyebrow">Phase 1 / personal sovereignty</p>
          <h2>Twelve operating pillars. One human authority.</h2>
          <p>Log what actually happened. Position 9 totals and reflects it; you decide what it means.</p>
        </div>
        <div className="sovereignty-authority" aria-label="Human authority and system witness">
          <span>WHOLE BODY MASTERY</span>
          <strong>YOU · Ø</strong>
          <small>Decision-maker</small>
          <i>Position 9 · witness only</i>
        </div>
      </header>

      <div className="sovereignty-boundary" role="status">
        <DataProvenanceBadge compact status={DATA_PROVENANCE.deviceLocal} />
        <span>{notice}</span>
        <button type="button" onClick={exportLedger} disabled={entries.length === 0}>Export JSON</button>
      </div>

      <form className="sovereignty-entry-form" onSubmit={addEntry}>
        <div className="sovereignty-form-heading">
          <span>Quick tag / about 30 seconds</span>
          <strong>What did you do?</strong>
        </div>
        <label className="sovereignty-description">
          <span>Action or event</span>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={180}
            placeholder="Finished the deployment handoff"
            required
          />
        </label>
        <label>
          <span>House</span>
          <select value={selectedHouse} onChange={(event) => setSelectedHouse(Number(event.target.value) as HouseNumber)}>
            {HOUSE_SPECTRUM_ORDER.map((house) => <option key={house.house} value={house.house}>{house.roman} · {house.name}</option>)}
          </select>
        </label>
        <label>
          <span>Measure</span>
          <select value={metric} onChange={(event) => setMetric(event.target.value as SovereigntyMetric)}>
            {Object.entries(SOVEREIGNTY_METRIC_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </label>
        {metric !== "action" && <label>
          <span>{metric === "minutes" ? "Minutes" : "USD"}</span>
          <input type="number" min="0.01" step={metric === "minutes" ? "1" : "0.01"} value={value} onChange={(event) => setValue(event.target.value)} required />
        </label>}
        <label>
          <span>Date</span>
          <input type="date" value={date} max={today} onChange={(event) => setDate(event.target.value)} required />
        </label>
        <button type="submit">Log to House {HOUSE_ROMAN[selectedHouse]}</button>
      </form>

      <div className="sovereignty-quick-tags" aria-label="Quick action examples">
        {QUICK_TAGS.map((tag) => <button
          key={tag.label}
          type="button"
          onClick={() => {
            setDescription(tag.label);
            setSelectedHouse(tag.house);
          }}
        >{HOUSE_ROMAN[tag.house]} · {tag.label}</button>)}
      </div>

      <div className="sovereignty-periods" aria-label="Report period">
        {([7, 30, 365] as LedgerPeriod[]).map((days) => <button key={days} type="button" data-active={period === days} onClick={() => setPeriod(days)}>
          {days === 7 ? "7 days" : days === 30 ? "30 days" : "1 year"}
        </button>)}
      </div>

      <div className="sovereignty-totals" aria-label="Selected period totals">
        <div><span>Actions</span><strong>{periodEntries}</strong></div>
        <div><span>Time</span><strong>{formatMinutes(totalMinutes)}</strong></div>
        <div><span>Spend</span><strong>{formatCurrency(totalSpend)}</strong></div>
        <div><span>Revenue</span><strong>{formatCurrency(totalRevenue)}</strong></div>
      </div>

      <div className="sovereignty-house-grid" aria-label="Twelve House activity summary">
        {HOUSE_SPECTRUM_ORDER.map((house) => {
          const summary = summaries[house.house];
          return <button
            key={house.house}
            type="button"
            data-selected={selectedHouse === house.house}
            onClick={() => setSelectedHouse(house.house)}
            style={{ "--house-color": house.colorHex } as LedgerStyle}
          >
            <span>{house.roman}</span>
            <strong>{house.name}</strong>
            <small>{summary.actions} {summary.actions === 1 ? "entry" : "entries"}</small>
          </button>;
        })}
      </div>

      <div className="sovereignty-focus" style={{ "--house-color": HOUSE_SPECTRUM[selectedHouse].colorHex } as LedgerStyle}>
        <article>
          <p className="eyebrow">House {HOUSE_ROMAN[selectedHouse]} / {selectedDefinition.name}</p>
          <h3>{selectedPillar.operatingLabel}</h3>
          <strong>{selectedPillar.function}</strong>
          <p>{selectedPillar.measures.join(" · ")}</p>
          <small>Operating-pillar label · legal entity status not verified by this app</small>
        </article>
        <dl>
          <div><dt>Entries</dt><dd>{selectedSummary.actions}</dd></div>
          <div><dt>Time</dt><dd>{formatMinutes(selectedSummary.minutes)}</dd></div>
          <div><dt>Spend</dt><dd>{formatCurrency(selectedSummary.spend)}</dd></div>
          <div><dt>Revenue</dt><dd>{formatCurrency(selectedSummary.revenue)}</dd></div>
        </dl>
      </div>

      <aside className="sovereignty-suggestion">
        <span>One transparent reflection</span>
        <h3>{suggestion.title}</h3>
        <p>{suggestion.body}</p>
        <small>{suggestion.disclosure}</small>
      </aside>

      <GuildEconomyPanel entries={entries} />

      <div className="sovereignty-history">
        <header><span>Local activity</span><strong>{entries.length} total entries</strong></header>
        {entries.length === 0 ? <p>No activity recorded yet. Your first honest entry starts the proof of concept.</p> : (
          <ol>
            {entries.slice(0, 20).map((entry) => <li key={entry.id}>
              <span>{HOUSE_ROMAN[entry.house]}</span>
              <div><strong>{entry.description}</strong><small>{entry.date} · {SOVEREIGNTY_METRIC_LABELS[entry.metric]}{entry.metric === "minutes" ? ` · ${formatMinutes(entry.value)}` : entry.metric === "spend" || entry.metric === "revenue" ? ` · ${formatCurrency(entry.value)}` : ""}</small></div>
              <button type="button" onClick={() => removeEntry(entry.id)} aria-label={`Delete ${entry.description}`}>Delete</button>
            </li>)}
          </ol>
        )}
      </div>

      <p className="sovereignty-deferred">Not connected: bank accounts, calendars, email, social networks, health data, AI classification, teams, or industry benchmarks.</p>
    </section>
  );
}

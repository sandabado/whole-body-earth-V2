"use client";

import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import {
  calculateRevenueAllocation,
  economyTotals,
  edgeIdForHouses,
  findShortestHouseRoute,
  GUILD_PROJECT_STORAGE_KEY,
  isGuildProject,
  type GuildProject,
  type GuildProjectStatus,
} from "@/lib/guild-economy";
import { HOUSE_ROMAN, HOUSE_SPECTRUM, HOUSE_SPECTRUM_ORDER } from "@/lib/house-spectrum";
import { summarizeSovereigntyEntries, type SovereigntyEntry } from "@/lib/sovereignty";
import { HOUSE_DEFINITIONS, type HouseNumber } from "@/types/houses";

type EconomyView = "economy" | "projects";
type EconomyPeriod = 30 | 365;
type EconomyStyle = CSSProperties & { "--house-color"?: string };

function periodStart(today: string, days: EconomyPeriod): string {
  if (!today) return "0000-00-00";
  const date = new Date(`${today}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - (days - 1));
  return date.toISOString().slice(0, 10);
}

function defaultDeadline(today: string): string {
  if (!today) return "";
  const date = new Date(`${today}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 14);
  return date.toISOString().slice(0, 10);
}

function money(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

function statusLabel(status: GuildProjectStatus): string {
  return status.replace("_", " ");
}

export function GuildEconomyPanel({ entries }: { entries: readonly SovereigntyEntry[] }) {
  const [view, setView] = useState<EconomyView>("economy");
  const [period, setPeriod] = useState<EconomyPeriod>(30);
  const [today, setToday] = useState("");
  const [projects, setProjects] = useState<GuildProject[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postingHouse, setPostingHouse] = useState<HouseNumber>(4);
  const [requiredHouse, setRequiredHouse] = useState<HouseNumber>(5);
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notice, setNotice] = useState("Projects and policy calculations remain on this device.");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const currentDate = new Date().toISOString().slice(0, 10);
      setToday(currentDate);
      setDeadline(defaultDeadline(currentDate));
      try {
        const stored = window.localStorage.getItem(GUILD_PROJECT_STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (Array.isArray(parsed)) setProjects(parsed.filter(isGuildProject));
        }
      } catch {
        setNotice("The local project board could not be read.");
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(GUILD_PROJECT_STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // Project actions surface write failures directly.
    }
  }, [hydrated, projects]);

  const startDate = periodStart(today, period);
  const houseSummaries = useMemo(() => summarizeSovereigntyEntries(entries, startDate), [entries, startDate]);
  const totals = useMemo(() => economyTotals(entries, startDate), [entries, startDate]);
  const allocationBasis = Math.max(0, totals.net);
  const allocations = useMemo(() => calculateRevenueAllocation(allocationBasis), [allocationBasis]);
  const sortedHouses = Object.values(houseSummaries).sort((left, right) => (
    (right.revenue - right.spend) - (left.revenue - left.spend) || left.house - right.house
  ));

  function addProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(budget);
    if (!title.trim() || !description.trim() || !deadline || !Number.isFinite(amount) || amount <= 0) {
      setNotice("Add a title, description, positive USD budget, and deadline.");
      return;
    }
    const now = new Date().toISOString();
    const project: GuildProject = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      postingHouse,
      requiredHouse,
      budget: amount,
      deadline,
      status: "open",
      createdAt: now,
      updatedAt: now,
    };
    try {
      const nextProjects = [project, ...projects];
      window.localStorage.setItem(GUILD_PROJECT_STORAGE_KEY, JSON.stringify(nextProjects));
      setProjects(nextProjects);
      setTitle("");
      setDescription("");
      setBudget("");
      setNotice(`Project posted locally from House ${HOUSE_ROMAN[postingHouse]} to House ${HOUSE_ROMAN[requiredHouse]}.`);
    } catch {
      setNotice("This browser blocked local storage, so the project was not saved.");
    }
  }

  function setProjectStatus(id: string, status: GuildProjectStatus) {
    setProjects((current) => current.map((project) => project.id === id
      ? { ...project, status, updatedAt: new Date().toISOString() }
      : project));
    setNotice(`Project marked ${statusLabel(status)} locally. No payment or escrow action occurred.`);
  }

  return (
    <section className="guild-economy" aria-label="Local Whole Body Guild economy proof of concept">
      <header className="guild-economy-header">
        <div>
          <p className="eyebrow">The Whole Body Guild / Phase 1</p>
          <h2>The geometry becomes an accountable economy.</h2>
          <p>Every dollar shown comes from your ledger. Every project route comes from the canonical dodecahedron.</p>
        </div>
        <div className="guild-economy-tabs" role="tablist" aria-label="Guild economy views">
          <button type="button" role="tab" aria-selected={view === "economy"} onClick={() => setView("economy")}>Economy</button>
          <button type="button" role="tab" aria-selected={view === "projects"} onClick={() => setView("projects")}>Project board</button>
        </div>
      </header>

      <div className="guild-economy-boundary" role="status">
        <strong>LOCAL PROOF OF CONCEPT</strong>
        <span>{notice}</span>
      </div>

      {view === "economy" ? <>
        <div className="guild-economy-toolbar">
          <span>Recorded economic activity</span>
          <div>
            <button type="button" data-active={period === 30} onClick={() => setPeriod(30)}>30 days</button>
            <button type="button" data-active={period === 365} onClick={() => setPeriod(365)}>1 year</button>
          </div>
        </div>

        <div className="guild-economy-totals">
          <div><span>Recorded revenue</span><strong>{money(totals.revenue)}</strong></div>
          <div><span>Recorded expenses</span><strong>{money(totals.expenses)}</strong></div>
          <div data-negative={totals.net < 0}><span>Net contribution</span><strong>{money(totals.net)}</strong></div>
          <div><span>Allocation basis</span><strong>{money(allocationBasis)}</strong><small>positive net only</small></div>
        </div>

        <div className="guild-house-economy" role="table" aria-label="House economic totals">
          <div className="guild-house-economy-row is-heading" role="row">
            <span role="columnheader">House</span><span role="columnheader">Revenue</span><span role="columnheader">Expenses</span><span role="columnheader">Net</span>
          </div>
          {sortedHouses.map((summary) => {
            const house = HOUSE_DEFINITIONS[summary.house];
            const net = summary.revenue - summary.spend;
            return <div className="guild-house-economy-row" role="row" key={summary.house} style={{ "--house-color": HOUSE_SPECTRUM[summary.house].colorHex } as EconomyStyle}>
              <span role="cell"><i>{HOUSE_ROMAN[summary.house]}</i><strong>{house.name}</strong></span>
              <span role="cell">{money(summary.revenue)}</span>
              <span role="cell">{money(summary.spend)}</span>
              <span role="cell" data-negative={net < 0}>{money(net)}</span>
            </div>;
          })}
        </div>

        <section className="guild-allocation" aria-label="Proposed revenue allocation simulation">
          <header>
            <div><span>Proposed policy simulation</span><h3>Where positive net could be assigned</h3></div>
            <strong>{money(allocationBasis)}</strong>
          </header>
          <div>
            {allocations.map((allocation) => <article key={allocation.id}>
              <span>{allocation.percent}%</span>
              <strong>{money(allocation.amount)}</strong>
              <small>{allocation.label}</small>
            </article>)}
          </div>
          <p>No money moved. No worker was paid. No reserve, trust, escrow, community fund, or governance account was funded.</p>
        </section>
      </> : <>
        <form className="guild-project-form" onSubmit={addProject}>
          <header><span>Post a local project</span><strong>Define the exchange before the work begins.</strong></header>
          <label><span>Title</span><input required maxLength={90} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Meditation track" /></label>
          <label className="guild-project-description"><span>Deliverable</span><textarea required maxLength={600} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the concrete result and acceptance criteria." /></label>
          <label><span>Posting House</span><select value={postingHouse} onChange={(event) => setPostingHouse(Number(event.target.value) as HouseNumber)}>{HOUSE_SPECTRUM_ORDER.map((house) => <option key={house.house} value={house.house}>{house.roman} · {house.name}</option>)}</select></label>
          <label><span>Required House</span><select value={requiredHouse} onChange={(event) => setRequiredHouse(Number(event.target.value) as HouseNumber)}>{HOUSE_SPECTRUM_ORDER.map((house) => <option key={house.house} value={house.house}>{house.roman} · {house.name}</option>)}</select></label>
          <label><span>Budget / USD</span><input required type="number" min="0.01" step="0.01" value={budget} onChange={(event) => setBudget(event.target.value)} /></label>
          <label><span>Deadline</span><input required type="date" min={today} value={deadline} onChange={(event) => setDeadline(event.target.value)} /></label>
          <button type="submit">Post locally</button>
        </form>

        <div className="guild-project-list">
          <header><span>Local guild board</span><strong>{projects.filter((project) => project.status !== "cancelled").length} active records</strong></header>
          {projects.length === 0 ? <p>No projects yet. Post one real need to activate a House-to-House route.</p> : projects.map((project) => {
            const route = findShortestHouseRoute(project.postingHouse, project.requiredHouse);
            const directEdge = route.length === 2 ? edgeIdForHouses(route[0], route[1]) : null;
            const visibility = route.length <= 1 ? "Within one House" : route.length === 2 ? "Direct neighbor" : route.length === 3 ? "Second-degree route" : "Guild-wide route";
            return <article key={project.id} data-status={project.status}>
              <header>
                <div><span>{statusLabel(project.status)}</span><h3>{project.title}</h3></div>
                <strong>{money(project.budget)}</strong>
              </header>
              <p>{project.description}</p>
              <div className="guild-project-route" aria-label="Dodecahedral House route">
                {route.map((house, index) => <span key={`${project.id}-${house}`} style={{ "--house-color": HOUSE_SPECTRUM[house].colorHex } as EconomyStyle}>{HOUSE_ROMAN[house]}{index < route.length - 1 ? " →" : ""}</span>)}
              </div>
              <dl>
                <div><dt>Route access</dt><dd>{visibility}</dd></div>
                <div><dt>Canonical edge</dt><dd>{directEdge ?? "multi-edge"}</dd></div>
                <div><dt>Deadline</dt><dd>{project.deadline}</dd></div>
                <div><dt>Money state</dt><dd>not funded</dd></div>
              </dl>
              <footer>
                {project.status === "open" && <button type="button" onClick={() => setProjectStatus(project.id, "in_progress")}>Start locally</button>}
                {project.status === "in_progress" && <button type="button" onClick={() => setProjectStatus(project.id, "completed")}>Mark complete</button>}
                {(project.status === "completed" || project.status === "cancelled") && <button type="button" onClick={() => setProjectStatus(project.id, "open")}>Reopen</button>}
                {project.status !== "cancelled" && <button type="button" onClick={() => setProjectStatus(project.id, "cancelled")}>Cancel record</button>}
              </footer>
              <small>Changing status does not accept a contract, verify delivery, log revenue, or move money.</small>
            </article>;
          })}
        </div>
      </>}

      <p className="guild-economy-deferred">Not live: members, rankings, trust performance, tax savings, liability protection, escrow, payments, PULZ, messaging, uploaded deliverables, or real-time guild totals.</p>
    </section>
  );
}

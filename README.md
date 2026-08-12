# Report Desk

A **non-technical guided interface** for running a Power BI delivery project through six specialist agents:

1. **Requirements & Proposal** — requirements matrix (+ proposal for new projects)
2. **Architecture & Layout** — data-flow diagram + page wireframes
3. **Data Feasibility** — coverage check against real schema/sample
4. **Build Guidance** — Power Query, relationships, DAX, visuals checklist
5. **QA / Validation** — Excel-ready test cases (human go/no-go)
6. **Documentation** — compiled technical doc from prior approvals

Each stage is a **living document**: chat in plain English, review the output on the right, ask for targeted changes, then **Approve & continue**.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

1. Click **Add API key** and paste an OpenAI API key (stored only in your browser).
2. Create a project and paste your report idea / notes / RSD.
3. Walk the six stages. Download markdown or JSON handoffs anytime.

## Notes for non-technical users

- You do **not** need to know Power BI formulas to use Stages 1–2 and 5–6.
- For Stage 3, ask your data person for a table/column list and paste it in.
- Stages stay editable after approval — say “change R4…” and only that item updates.

## Tech

- Next.js (App Router) + TypeScript + Tailwind
- OpenAI Chat Completions API (your key)
- Project state in browser `localStorage`

# Formula Builder (Angular 17 + Rete v2)
A tiny sandbox to try a visual formula-builder with KPI, Stat value, Group (“calculate me first”), and + - * /.

## Try it on StackBlitz
1. Go to stackblitz.com
2. Click **Create Project → Upload project** and upload this ZIP.
3. It should auto-install and run `ng serve` (or click **Start**).

## Run locally
```bash
npm i
npm start
```
Then open http://localhost:4200

## What it does
Builds the graph for: `((KPI1 / KPI2) + (KPI1 / KPI3)) * 100` and shows the generated expression and a demo evaluation.

## Notes
- No `eval` is used; evaluation runs on a small AST over whitelisted operators and KPI names.
- You can extend nodes to add dropdowns for KPI/Stat selection and to change operators on the fly.

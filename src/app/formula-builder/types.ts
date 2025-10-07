export type Operator = '+' | '-' | '*' | '/';

export interface KpiDef {
  id: string;
  label: string;
}

export interface StatDef {
  id: string;
  label: string;
  value: number;
}

export interface FormulaContext {
  kpis: Record<string, number>;
}

import type { Expr } from './graph-to-expression';
import type { FormulaContext } from './types';

export function evaluateExpr(expr: Expr, ctx: FormulaContext): number {
  switch(expr.kind){
    case 'val':
      if (/^-?\d+(?:\.\d+)?$/.test(expr.text)) return Number(expr.text);
      if (expr.text in ctx.kpis) return ctx.kpis[expr.text];
      throw new Error(`Ukendt symbol: ${expr.text}`);
    case 'group':
      return evaluateExpr(expr.inner, ctx);
    case 'op': {
      const a = evaluateExpr(expr.left, ctx);
      const b = evaluateExpr(expr.right, ctx);
      switch(expr.op){
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/':
          if (b === 0) throw new Error('Division med 0');
          return a / b;
      }
    }
  }
}

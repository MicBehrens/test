import type { Node } from '@rete/core';
import { KpiNode } from './nodes/kpi.node';
import { StatNode } from './nodes/stat.node';
import { GroupNode } from './nodes/group.node';
import { BinaryOpNode } from './nodes/binary-op.node';
import { Operator } from './types';

export type Expr =
  | { kind: 'val', text: string }
  | { kind: 'op', op: Operator, left: Expr, right: Expr }
  | { kind: 'group', inner: Expr };

function precedence(op: Operator){ return (op === '*' || op === '/') ? 2 : 1; }

export function buildExpression(root: Node): Expr {
  if (root instanceof KpiNode){
    return { kind: 'val', text: root.kpiId };
  }
  if (root instanceof StatNode){
    return { kind: 'val', text: String(root.value) };
  }
  if (root instanceof GroupNode){
    const inp = root.inputs.get('inp');
    const con = inp?.connections[0];
    if (!con) throw new Error('Group mangler input');
    const fromNode = con.source?.node as Node;
    return { kind: 'group', inner: buildExpression(fromNode) };
  }
  if (root instanceof BinaryOpNode){
    const a = root.inputs.get('a'); const b = root.inputs.get('b');
    const ca = a?.connections[0]; const cb = b?.connections[0];
    if (!ca || !cb) throw new Error('Operator mangler A eller B');
    const left = buildExpression(ca.source!.node as Node);
    const right = buildExpression(cb.source!.node as Node);
    return { kind: 'op', op: root.op, left, right };
  }
  throw new Error('Ukendt node-type');
}

export function exprToString(expr: Expr): string {
  switch(expr.kind){
    case 'val': return expr.text;
    case 'group': return `(${exprToString(expr.inner)})`;
    case 'op': {
      const l = expr.left; const r = expr.right;
      const ltxt = needsParenLeft(expr, l) ? `(${exprToString(l)})` : exprToString(l);
      const rtxt = needsParenRight(expr, r) ? `(${exprToString(r)})` : exprToString(r);
      return `${ltxt} ${expr.op} ${rtxt}`;
    }
  }
}

function needsParenLeft(parent: Extract<Expr, {kind:'op'}>, child: Expr){
  if (child.kind !== 'op') return false;
  return precedence(child.op) < precedence(parent.op);
}
function needsParenRight(parent: Extract<Expr, {kind:'op'}>, child: Expr){
  if (child.kind !== 'op') return false;
  return precedence(child.op) <= precedence(parent.op);
}

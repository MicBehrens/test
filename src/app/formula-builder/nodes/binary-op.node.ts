import { Node, Input, Output } from '@rete/core';
import { NumSocket } from '../sockets';
import type { Operator } from '../types';

export class BinaryOpNode extends Node<{ a: Input; b: Input; out: Output }>{
  static type = 'BINARY_OP';
  public op: Operator;
  constructor(op: Operator){
    super(BinaryOpNode.type);
    this.op = op;
    const a = new Input('a', 'A', NumSocket);
    const b = new Input('b', 'B', NumSocket);
    const out = new Output('out', `A ${op} B`, NumSocket);
    this.addInput(a); this.addInput(b); this.addOutput(out);
  }
  setOperator(op: Operator){ this.op = op; const out = this.outputs.get('out'); if (out) out.label = `A ${op} B`; }
}

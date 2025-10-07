import { Node, Output } from '@rete/core';
import { NumSocket } from '../sockets';
import type { StatDef } from '../types';

export class StatNode extends Node<{ out: Output }>{
  static type = 'STAT';
  public statId: string; public label: string; public value: number;
  constructor(stat: StatDef){
    super(StatNode.type);
    this.statId = stat.id; this.label = stat.label; this.value = stat.value;
    const out = new Output('out', this.label, NumSocket);
    this.addOutput(out);
  }
}

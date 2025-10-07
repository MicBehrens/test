import { Node, Output } from '@rete/core';
import { NumSocket } from '../sockets';
import type { KpiDef } from '../types';

export class KpiNode extends Node<{ out: Output }>{
  static type = 'KPI';
  public kpiId: string; public label: string;
  constructor(kpi: KpiDef){
    super(KpiNode.type);
    this.kpiId = kpi.id; this.label = kpi.label;
    const out = new Output('out', kpi.label, NumSocket);
    this.addOutput(out);
  }
}

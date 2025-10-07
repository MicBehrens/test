import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeEditor } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';
import { AngularPlugin, Presets, AngularArea2D } from 'rete-angular-plugin/17';

import { KpiNode } from './nodes/kpi.node';
import { StatNode } from './nodes/stat.node';
import { GroupNode } from './nodes/group.node';
import { BinaryOpNode } from './nodes/binary-op.node';
import { buildExpression, exprToString } from './graph-to-expression';
import { evaluateExpr } from './evaluator';
import type { FormulaContext, KpiDef, StatDef } from './types';

@Component({
  selector: 'im-formula-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formula-editor.component.html'
})
export class FormulaEditorComponent implements OnInit {
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;

  public formulaText = '';
  public result: number | null = null;
  public error: string | null = null;

  private editor!: NodeEditor;
  private area!: AngularArea2D<any>;

  private kpis: KpiDef[] = [
    { id: 'KPI1', label: 'KPI1' },
    { id: 'KPI2', label: 'KPI2' },
    { id: 'KPI3', label: 'KPI3' }
  ];
  private stats: StatDef[] = [ { id: 'CONST_100', label: '100', value: 100 } ];

  async ngOnInit(){
    this.editor = new NodeEditor();

    this.area = new AngularArea2D(this.editor, this.host.nativeElement);
    const areaPlugin = new AreaPlugin(this.area);
    const conn = new ConnectionPlugin(this.area, { curvature: 0.2 });

    Presets.classic.setup(this.area);
    ConnectionPresets.classic.setup(conn);

    // Build graph: ((KPI1 / KPI2) + (KPI1 / KPI3)) * 100
    const kpi1a = new KpiNode(this.kpis[0]);
    const kpi2  = new KpiNode(this.kpis[1]);
    const kpi1b = new KpiNode(this.kpis[0]);
    const kpi3  = new KpiNode(this.kpis[2]);
    const c100  = new StatNode(this.stats[0]);

    const div1 = new BinaryOpNode('/');
    const div2 = new BinaryOpNode('/');
    const add  = new BinaryOpNode('+');
    const mul  = new BinaryOpNode('*');

    const g1 = new GroupNode();
    const g2 = new GroupNode();

    await this.editor.addNode(kpi1a, { position: [50, 40] });
    await this.editor.addNode(kpi2,  { position: [50, 160] });
    await this.editor.addNode(kpi1b, { position: [50, 320] });
    await this.editor.addNode(kpi3,  { position: [50, 440] });
    await this.editor.addNode(c100,  { position: [650, 240] });

    await this.editor.addNode(div1,  { position: [260, 80] });
    await this.editor.addNode(div2,  { position: [260, 360] });
    await this.editor.addNode(g1,    { position: [420, 80] });
    await this.editor.addNode(g2,    { position: [420, 360] });
    await this.editor.addNode(add,   { position: [560, 200] });
    await this.editor.addNode(mul,   { position: [820, 200] });

    await this.editor.addConnection({ source: kpi1a, sourceOutput: 'out', target: div1, targetInput: 'a' });
    await this.editor.addConnection({ source: kpi2,  sourceOutput: 'out', target: div1, targetInput: 'b' });
    await this.editor.addConnection({ source: kpi1b, sourceOutput: 'out', target: div2, targetInput: 'a' });
    await this.editor.addConnection({ source: kpi3,  sourceOutput: 'out', target: div2, targetInput: 'b' });
    await this.editor.addConnection({ source: div1,  sourceOutput: 'out', target: g1,  targetInput: 'inp' });
    await this.editor.addConnection({ source: div2,  sourceOutput: 'out', target: g2,  targetInput: 'inp' });
    await this.editor.addConnection({ source: g1, sourceOutput: 'out', target: add, targetInput: 'a' });
    await this.editor.addConnection({ source: g2, sourceOutput: 'out', target: add, targetInput: 'b' });
    await this.editor.addConnection({ source: add, sourceOutput: 'out', target: mul, targetInput: 'a' });
    await this.editor.addConnection({ source: c100, sourceOutput: 'out', target: mul, targetInput: 'b' });

    AreaExtensions.zoomAt(this.area, this.editor.getNodes());

    this.refreshPreview(mul);
  }

  refreshPreview(rootNode: any){
    try{
      const expr = buildExpression(rootNode);
      this.formulaText = exprToString(expr);
      const ctx = { kpis: { KPI1: 120, KPI2: 60, KPI3: 30 } } as FormulaContext;
      this.result = evaluateExpr(expr, ctx);
      this.error = null;
    } catch(e: any){
      this.error = e?.message ?? String(e);
      this.result = null;
    }
  }
}

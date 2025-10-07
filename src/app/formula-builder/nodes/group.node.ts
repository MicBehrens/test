import { Node, Input, Output } from 'rete';
import { NumSocket } from '../sockets';

export class GroupNode extends Node<{ inp: Input; out: Output }>{
  static type = 'GROUP';
  constructor(){
    super(GroupNode.type);
    const inp = new Input('inp', 'Ind', NumSocket);
    const out = new Output('out', 'Ud', NumSocket);
    this.addInput(inp); this.addOutput(out);
  }
}

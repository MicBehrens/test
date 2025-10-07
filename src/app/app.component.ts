import { Component } from '@angular/core';
import { FormulaEditorComponent } from './formula-builder/formula-editor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormulaEditorComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {}

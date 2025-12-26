import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface Step {
  label: string;
  completed: boolean;
  valid?: boolean;
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './stepper.component.html',
})
export class StepperComponent {
  @Input() steps: Step[] = [];
  @Output() stepChange = new EventEmitter<number>();

  currentStep = signal(0);

  next(): void {
    if (this.currentStep() < this.steps.length - 1) {
      this.currentStep.update((val) => val + 1);
      this.stepChange.emit(this.currentStep());
    }
  }

  previous(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update((val) => val - 1);
      this.stepChange.emit(this.currentStep());
    }
  }

  goToStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      this.currentStep.set(index);
      this.stepChange.emit(this.currentStep());
    }
  }
}

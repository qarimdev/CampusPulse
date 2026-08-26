import { CommonModule } from '@angular/common';
import { Component, Input, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Course } from '../../services/course';

export interface GradeThreshold {
  label: string;
  minPct: number;
}

@Component({
  selector: 'app-grade-target-calc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grade-target-calc.component.html',
  styleUrl: './grade-target-calc.component.scss',
})
export class GradeTargetCalcComponent {
  @Input() courses: Course[] = [];

  // Expose Math.max to the HTML template (Step 3)
  protected readonly mathMax = Math.max;

  // Inputs
  selectedCourseCode = signal<string>('');
  currentCourseworkScore = signal<number>(42); // Score out of coursework weight
  courseworkWeight = signal<number>(60); // e.g., 60%
  targetGradePct = signal<number>(80); // e.g., 80% for A-

  // Grade Scale Presets
  gradeScale: GradeThreshold[] = [
    { label: 'A+ (90%)', minPct: 90 },
    { label: 'A (85%)', minPct: 85 },
    { label: 'A- (80%)', minPct: 80 },
    { label: 'B+ (75%)', minPct: 75 },
    { label: 'B (70%)', minPct: 70 },
    { label: 'C+ (65%)', minPct: 65 },
    { label: 'C (60%)', minPct: 60 },
  ];

  // Calculated values using Signals
  finalExamWeight = computed(() => {
    const cwWeight = Math.min(Math.max(this.courseworkWeight(), 0), 100);
    return 100 - cwWeight;
  });

  neededFinalScorePct = computed(() => {
    const target = this.targetGradePct();
    const currentScore = this.currentCourseworkScore();
    const finalWeight = this.finalExamWeight();

    if (finalWeight <= 0) return 0;

    // Calculation: (Target Total % - Current Earned %) / Final Weight * 100
    const needed = ((target - currentScore) / finalWeight) * 100;
    return Math.max(0, Math.round(needed * 10) / 10);
  });

  statusMessage = computed(() => {
    const needed = this.neededFinalScorePct();
    if (needed > 100) {
      return {
        type: 'danger',
        text: `Mathematically impossible! You would need ${needed}% on the final.`,
      };
    } else if (needed > 85) {
      return {
        type: 'warning',
        text: `Challenging target! Requires a top-tier score of ${needed}% on the final.`,
      };
    } else if (needed === 0) {
      return {
        type: 'success',
        text: `Goal secured! You have already passed your target prior to finals.`,
      };
    } else {
      return {
        type: 'success',
        text: `Achievable! Aim for at least ${needed}% on your final exam.`,
      };
    }
  });

  setTargetFromPreset(pct: number): void {
    this.targetGradePct.set(pct);
  }
}

import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  pauseTime: number;
  repetitions: number;
}

@Component({
  selector: 'cm-breathing',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './breathing.component.html',
  styleUrl: './breathing.component.scss'
})
export class BreathingComponent implements OnDestroy {
  breathingExercises: BreathingExercise[] = [
    {
      id: '1',
      name: 'Respiração 4-7-8',
      description: 'Inspire por 4 segundos, segure por 7 segundos e expire por 8 segundos. Ideal para acalmar o sistema nervoso.',
      inhaleTime: 4,
      holdTime: 7,
      exhaleTime: 8,
      pauseTime: 2,
      repetitions: 5
    },
    {
      id: '2',
      name: 'Respiração Abdominal',
      description: 'Inspire profundamente pela barriga por 5 segundos e expire lentamente por 5 segundos. Relaxa corpo e mente.',
      inhaleTime: 5,
      holdTime: 0,
      exhaleTime: 5,
      pauseTime: 2,
      repetitions: 10
    },
    {
      id: '3',
      name: 'Respiração Quadrada',
      description: 'Inspire por 4 segundos, segure por 4 segundos, expire por 4 segundos e pause por 4 segundos. Promove equilíbrio.',
      inhaleTime: 4,
      holdTime: 4,
      exhaleTime: 4,
      pauseTime: 4,
      repetitions: 8
    }
  ];
  
  selectedExercise: BreathingExercise | null = null;
  breathingState: 'inhale' | 'hold' | 'exhale' | 'pause' = 'inhale';
  breathingStateText = 'Inspire';
  isExerciseActive = false;
  timer = 0;
  timerDisplay = '0';
  currentRepetition = 0;
  progressPercentage = 0;
  
  private destroy$ = new Subject<void>();
  private intervalSubscription: any;
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }
  
  selectExercise(exercise: BreathingExercise): void {
    this.resetExercise();
    this.selectedExercise = exercise;
  }
  
  toggleExercise(): void {
    if (!this.selectedExercise) return;
    
    this.isExerciseActive = !this.isExerciseActive;
    
    if (this.isExerciseActive) {
      if (this.currentRepetition === 0) {
        this.startNewCycle();
      }
      
      this.intervalSubscription = interval(1000)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.updateBreathingExercise());
    } else {
      if (this.intervalSubscription) {
        this.intervalSubscription.unsubscribe();
      }
    }
  }
  
  resetExercise(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    
    this.isExerciseActive = false;
    this.breathingState = 'inhale';
    this.breathingStateText = 'Inspire';
    this.timer = 0;
    this.timerDisplay = '0';
    this.currentRepetition = 0;
    this.progressPercentage = 0;
  }
  
  private updateBreathingExercise(): void {
    if (!this.selectedExercise) return;
    
    this.timer--;
    this.timerDisplay = this.timer.toString();
    
    if (this.timer <= 0) {
      this.moveToNextBreathingState();
    }
    
    this.updateProgress();
  }
  
  private moveToNextBreathingState(): void {
    if (!this.selectedExercise) return;
    
    switch (this.breathingState) {
      case 'inhale':
        if (this.selectedExercise.holdTime > 0) {
          this.breathingState = 'hold';
          this.breathingStateText = 'Segure';
          this.timer = this.selectedExercise.holdTime;
        } else {
          this.breathingState = 'exhale';
          this.breathingStateText = 'Expire';
          this.timer = this.selectedExercise.exhaleTime;
        }
        break;
        
      case 'hold':
        this.breathingState = 'exhale';
        this.breathingStateText = 'Expire';
        this.timer = this.selectedExercise.exhaleTime;
        break;
        
      case 'exhale':
        if (this.selectedExercise.pauseTime > 0) {
          this.breathingState = 'pause';
          this.breathingStateText = 'Pause';
          this.timer = this.selectedExercise.pauseTime;
        } else {
          this.completeCycle();
        }
        break;
        
      case 'pause':
        this.completeCycle();
        break;
    }
  }
  
  private completeCycle(): void {
    if (!this.selectedExercise) return;
    
    this.currentRepetition++;
    
    if (this.currentRepetition >= this.selectedExercise.repetitions) {
      this.isExerciseActive = false;
      this.intervalSubscription.unsubscribe();
      
      this.breathingState = 'inhale';
      this.breathingStateText = 'Concluído';
      this.timer = 0;
      this.timerDisplay = '✓';
      this.progressPercentage = 100;
    } else {
      this.startNewCycle();
    }
  }
  
  private startNewCycle(): void {
    if (!this.selectedExercise) return;
    
    this.breathingState = 'inhale';
    this.breathingStateText = 'Inspire';
    this.timer = this.selectedExercise.inhaleTime;
  }
  
  private updateProgress(): void {
    if (!this.selectedExercise) return;
    
    const totalCycles = this.selectedExercise.repetitions;
    const currentCycleProgress = this.calculateCurrentCycleProgress();
    
    this.progressPercentage = ((this.currentRepetition + currentCycleProgress) / totalCycles) * 100;
  }
  
  private calculateCurrentCycleProgress(): number {
    if (!this.selectedExercise) return 0;
    
    const { inhaleTime, holdTime, exhaleTime, pauseTime } = this.selectedExercise;
    const totalCycleTime = inhaleTime + holdTime + exhaleTime + pauseTime;
    
    let elapsedTime;
    
    switch (this.breathingState) {
      case 'inhale':
        elapsedTime = inhaleTime - this.timer;
        return elapsedTime / totalCycleTime;
        
      case 'hold':
        elapsedTime = inhaleTime + (holdTime - this.timer);
        return elapsedTime / totalCycleTime;
        
      case 'exhale':
        elapsedTime = inhaleTime + holdTime + (exhaleTime - this.timer);
        return elapsedTime / totalCycleTime;
        
      case 'pause':
        elapsedTime = inhaleTime + holdTime + exhaleTime + (pauseTime - this.timer);
        return elapsedTime / totalCycleTime;
        
      default:
        return 0;
    }
  }
}
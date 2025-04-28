import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'cm-emergency',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './emergency.component.html',
  styleUrl: './emergency.component.scss'
})
export class EmergencyComponent {
  breathingText = 'Respire';
  
  constructor() {
    this.startBreathingAnimation();
  }
  
  startBreathingAnimation(): void {
    let phase = 0;
    
    setInterval(() => {
      switch(phase) {
        case 0:
          this.breathingText = 'Inspire';
          break;
        case 1:
          this.breathingText = 'Segure';
          break;
        case 2:
          this.breathingText = 'Expire';
          break;
        case 3:
          this.breathingText = 'Pause';
          break;
      }
      
      phase = (phase + 1) % 4;
    }, 1500);
  }
}
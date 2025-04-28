import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

interface AnxietySlide {
  imageUrl: string;
  title: string;
  description: string;
}

@Component({
  selector: 'cm-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isLoggedIn$ = this.authService.isLoggedIn$;
  currentSlide = 0;

  anxietySlides: AnxietySlide[] = [
    {
      imageUrl: 'https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg',
      title: 'Sintomas Físicos',
      description: 'Aprenda a identificar sinais como coração acelerado, suor excessivo, tremores e tensão muscular.'
    },
    {
      imageUrl: 'https://images.pexels.com/photos/3807758/pexels-photo-3807758.jpeg',
      title: 'Pensamentos Recorrentes',
      description: 'Reconheça padrões de preocupação excessiva, pensamentos negativos e medos irracionais.'
    },
    {
      imageUrl: 'https://images.pexels.com/photos/3807754/pexels-photo-3807754.jpeg',
      title: 'Mudanças Comportamentais',
      description: 'Observe alterações no sono, alimentação e tendência a evitar situações específicas.'
    },
    {
      imageUrl: 'https://images.pexels.com/photos/3807752/pexels-photo-3807752.jpeg',
      title: 'Impacto no Cotidiano',
      description: 'Identifique como a ansiedade afeta suas relações, trabalho e atividades diárias.'
    }
  ];

  constructor(private authService: AuthService) {}

  previousSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  nextSlide(): void {
    if (this.currentSlide < this.anxietySlides.length - 1) {
      this.currentSlide++;
    }
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}
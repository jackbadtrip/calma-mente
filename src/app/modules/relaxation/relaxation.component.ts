import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';

interface RelaxationExercise {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: number;
  type: 'meditation' | 'stretching' | 'sound';
  audioUrl?: string;
  instructions?: string[];
}

interface SoundItem {
  id: string;
  name: string;
  description: string;
  audioUrl: string;
  imageUrl: string;
}

@Component({
  selector: 'cm-relaxation',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSliderModule,
    MatProgressBarModule,
    FormsModule
  ],
  templateUrl: './relaxation.component.html',
  styleUrl: './relaxation.component.scss'
})
export class RelaxationComponent {
  relaxationExercises: RelaxationExercise[] = [
    {
      id: '1',
      title: 'Meditação Mindfulness',
      description: 'Uma meditação guiada para trazer sua atenção ao momento presente e reduzir a ansiedade.',
      imageUrl: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
      duration: 300, // 5 minutos em segundos
      type: 'meditation',
      audioUrl: 'https://example.com/meditation1.mp3'
    },
    {
      id: '2',
      title: 'Escaneamento Corporal',
      description: 'Uma técnica de relaxamento que envolve atenção focada em diferentes partes do corpo.',
      imageUrl: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
      duration: 600, // 10 minutos em segundos
      type: 'meditation',
      audioUrl: 'https://example.com/meditation2.mp3'
    },
    {
      id: '3',
      title: 'Meditação para Dormir',
      description: 'Uma meditação suave para ajudar a acalmar a mente e preparar para uma boa noite de sono.',
      imageUrl: 'https://images.pexels.com/photos/355887/pexels-photo-355887.jpeg',
      duration: 900, // 15 minutos em segundos
      type: 'meditation',
      audioUrl: 'https://example.com/meditation3.mp3'
    },
    {
      id: '4',
      title: 'Alongamento de Pescoço e Ombros',
      description: 'Exercícios suaves para aliviar a tensão no pescoço e ombros, comuns em momentos de ansiedade.',
      imageUrl: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg',
      duration: 300, // 5 minutos em segundos
      type: 'stretching',
      instructions: [
        'Sente-se com a coluna reta e ombros relaxados.',
        'Incline a cabeça lentamente para a direita, tentando tocar a orelha no ombro.',
        'Mantenha por 15-30 segundos e volte ao centro.',
        'Repita do lado esquerdo.',
        'Gire lentamente os ombros para trás 5 vezes.',
        'Gire lentamente os ombros para frente 5 vezes.',
        'Traga os ombros em direção às orelhas, segure por 5 segundos e solte.'
      ]
    },
    {
      id: '5',
      title: 'Alongamento de Costas',
      description: 'Exercícios para aliviar a tensão nas costas e melhorar a postura.',
      imageUrl: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg',
      duration: 300, // 5 minutos em segundos
      type: 'stretching',
      instructions: [
        'Sente-se no chão com as pernas estendidas à frente.',
        'Dobre o joelho direito e coloque o pé sobre a coxa esquerda ou ao lado do joelho esquerdo.',
        'Gire o tronco em direção à perna dobrada, colocando o cotovelo esquerdo do lado de fora do joelho direito.',
        'Mantenha por 30 segundos e alterne os lados.',
        'Deite-se de costas, puxe ambos os joelhos em direção ao peito e abrace-os.',
        'Mantenha por 30 segundos, relaxe e repita.'
      ]
    },
    {
      id: '6',
      title: 'Relaxamento Muscular Progressivo',
      description: 'Técnica que envolve tensionar e relaxar grupos musculares para reduzir a tensão física.',
      imageUrl: 'https://images.pexels.com/photos/8939492/pexels-photo-8939492.jpeg',
      duration: 600, // 10 minutos em segundos
      type: 'stretching',
      instructions: [
        'Deite-se de costas em uma posição confortável.',
        'Comece pelos pés: contraia os músculos dos pés por 5 segundos, depois relaxe.',
        'Mova para as panturrilhas: contraia por 5 segundos, depois relaxe.',
        'Continue subindo pelo corpo: coxas, glúteos, abdômen, peito, braços, mãos, ombros, pescoço e rosto.',
        'Para cada grupo muscular, contraia por 5 segundos e depois relaxe por 10 segundos.',
        'No final, note como seu corpo está mais relaxado.'
      ]
    }
  ];
  
  relaxingSounds: SoundItem[] = [
    {
      id: 's1',
      name: 'Chuva',
      description: 'Sons relaxantes de chuva para criar um ambiente calmo e aconchegante.',
      audioUrl: 'https://example.com/rain.mp3',
      imageUrl: 'https://images.pexels.com/photos/125510/pexels-photo-125510.jpeg'
    },
    {
      id: 's2',
      name: 'Oceano',
      description: 'Ondas do mar quebrando na praia, perfeito para relaxar e meditar.',
      audioUrl: 'https://example.com/ocean.mp3',
      imageUrl: 'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg'
    },
    {
      id: 's3',
      name: 'Floresta',
      description: 'Sons da natureza, incluindo pássaros e folhas ao vento.',
      audioUrl: 'https://example.com/forest.mp3',
      imageUrl: 'https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg'
    },
    {
      id: 's4',
      name: 'Ruído Branco',
      description: 'Um som constante que ajuda a mascarar outros ruídos e promove a concentração.',
      audioUrl: 'https://example.com/whitenoise.mp3',
      imageUrl: 'https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg'
    }
  ];
  
  activeExercise: RelaxationExercise | null = null;
  remainingTime: number = 0;
  progressValue: number = 100;
  isTimerRunning: boolean = false;
  timerInterval: any;
  
  currentSound: SoundItem | null = null;
  audioElement: HTMLAudioElement | null = null;
  soundVolume: number = 0.5;
  
  getMeditationExercises(): RelaxationExercise[] {
    return this.relaxationExercises.filter(exercise => exercise.type === 'meditation');
  }
  
  getStretchingExercises(): RelaxationExercise[] {
    return this.relaxationExercises.filter(exercise => exercise.type === 'stretching');
  }
  
  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  }
  
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  startExercise(exercise: RelaxationExercise): void {
    this.activeExercise = exercise;
    this.remainingTime = exercise.duration;
    this.progressValue = 100;
    this.isTimerRunning = false;
    this.resetTimer();
  }
  
  closeExercise(): void {
    this.stopTimer();
    this.activeExercise = null;
  }
  
  toggleTimer(): void {
    if (this.isTimerRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }
  
  startTimer(): void {
    if (!this.isTimerRunning && this.remainingTime > 0) {
      this.isTimerRunning = true;
      this.timerInterval = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
          this.updateProgress();
        } else {
          this.stopTimer();
        }
      }, 1000);
    }
  }
  
  pauseTimer(): void {
    this.isTimerRunning = false;
    clearInterval(this.timerInterval);
  }
  
  stopTimer(): void {
    this.isTimerRunning = false;
    clearInterval(this.timerInterval);
  }
  
  resetTimer(): void {
    this.stopTimer();
    if (this.activeExercise) {
      this.remainingTime = this.activeExercise.duration;
      this.progressValue = 100;
    }
  }
  
  updateProgress(): void {
    if (this.activeExercise) {
      this.progressValue = (this.remainingTime / this.activeExercise.duration) * 100;
    }
  }
  
  toggleSound(sound: SoundItem): void {
    if (this.isPlayingSound(sound)) {
      this.stopSound();
    } else {
      this.playSound(sound);
    }
  }
  
  playSound(sound: SoundItem): void {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    
    this.currentSound = sound;
    this.audioElement = new Audio(sound.audioUrl);
    this.audioElement.loop = true;
    this.audioElement.volume = this.soundVolume;
    this.audioElement.play().catch(error => {
      console.error('Error playing audio:', error);
    });
  }
  
  stopSound(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
    this.currentSound = null;
  }
  
  isPlayingSound(sound: SoundItem): boolean {
    return this.currentSound?.id === sound.id;
  }
  
  updateVolume(value: number): void {
    if (this.audioElement) {
      this.audioElement.volume = value;
    }
  }
}
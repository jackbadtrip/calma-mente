import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DiaryEntry } from '../../../core/models/diary-entry.model';

@Component({
  selector: 'cm-diary-entry',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './diary-entry.component.html',
  styleUrl: './diary-entry.component.scss'
})
export class DiaryEntryComponent {
  @Input() entry!: DiaryEntry;
  @Output() edit = new EventEmitter<DiaryEntry>();
  @Output() delete = new EventEmitter<string>();
  
  getFormattedDate(): string {
    if (!this.entry.createdAt) return '';
    
    const date = this.entry.createdAt instanceof Date 
      ? this.entry.createdAt 
      : new Date(this.entry.createdAt.seconds * 1000);
    
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  getMoodClass(): string {
    return `mood-${this.entry.mood}`;
  }
  
  getMoodLabel(): string {
    switch(this.entry.mood) {
      case 1: return 'Muito Ruim';
      case 2: return 'Ruim';
      case 3: return 'Neutro';
      case 4: return 'Bom';
      case 5: return 'Muito Bom';
      default: return 'Indefinido';
    }
  }
  
  onEdit(): void {
    this.edit.emit(this.entry);
  }
  
  onDelete(): void {
    this.delete.emit(this.entry.id);
  }
}
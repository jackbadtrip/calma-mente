import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DiaryService } from '../../core/services/diary.service';
import { AuthService } from '../../core/services/auth.service';
import { DiaryEntryComponent } from './diary-entry/diary-entry.component';
import { DiaryFormComponent } from './diary-form/diary-form.component';
import { DiaryEntry } from '../../core/models/diary-entry.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cm-diary',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSliderModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    DiaryEntryComponent,
    DiaryFormComponent
  ],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss'
})
export class DiaryComponent implements OnInit {
  entries$: Observable<DiaryEntry[]>;
  isLoading = true;
  
  constructor(
    private diaryService: DiaryService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.entries$ = this.diaryService.getEntries().pipe(
      map(entries => {
        this.isLoading = false;
        return entries;
      })
    );
  }
  
  ngOnInit(): void {
  }
  
  openDiaryForm(entry?: DiaryEntry): void {
    const dialogRef = this.dialog.open(DiaryFormComponent, {
      width: '600px',
      data: entry || null
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        
        this.entries$ = this.diaryService.getEntries().pipe(
          map(entries => {
            this.isLoading = false;
            return entries;
          })
        );
      }
    });
  }
  
  editEntry(entry: DiaryEntry): void {
    this.openDiaryForm(entry);
  }
  
  deleteEntry(entryId: string): void {
    if (confirm('Tem certeza que deseja excluir esta entrada do diário?')) {
      this.isLoading = true;
      this.diaryService.deleteEntry(entryId).subscribe(() => {
        
        this.entries$ = this.diaryService.getEntries().pipe(
          map(entries => {
            this.isLoading = false;
            return entries;
          })
        );
      });
    }
  }
}
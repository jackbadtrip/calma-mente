import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DiaryService } from '../../../core/services/diary.service';
import { AuthService } from '../../../core/services/auth.service';
import { DiaryEntry } from '../../../core/models/diary-entry.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface MoodOption {
  value: number;
  emoji: string;
  label: string;
}

@Component({
  selector: 'cm-diary-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './diary-form.component.html',
  styleUrl: './diary-form.component.scss'
})
export class DiaryFormComponent implements OnInit {
  diaryForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  
  feelings: string[] = [];
  activities: string[] = [];
  
  moodOptions: MoodOption[] = [
    { value: 1, emoji: '😢', label: 'Muito Ruim' },
    { value: 2, emoji: '😕', label: 'Ruim' },
    { value: 3, emoji: '😐', label: 'Neutro' },
    { value: 4, emoji: '🙂', label: 'Bom' },
    { value: 5, emoji: '😄', label: 'Muito Bom' }
  ];
  
  predefinedQuestions = [
    'O que foi a melhor parte do seu dia?',
    'O que você aprendeu hoje?',
    'Houve algo que te deixou ansioso(a) hoje? Como você lidou com isso?'
  ];
  
  get questions() {
    return this.diaryForm.get('questions') as FormArray;
  }
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DiaryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DiaryEntry | null,
    private diaryService: DiaryService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.diaryForm = this.fb.group({
      content: ['', Validators.required],
      mood: [3],
      questions: this.fb.array([]),
      feelings: [[]],
      activities: [[]]
    });
    
    this.isEditMode = !!data;
    
    this.initializeQuestionsFormArray();
  }
  
  ngOnInit(): void {
    if (this.isEditMode && this.data) {
      this.feelings = this.data.feelings || [];
      this.activities = this.data.activities || [];
      
      this.diaryForm.patchValue({
        content: this.data.content,
        mood: this.data.mood,
        feelings: this.feelings,
        activities: this.activities
      });
      
      if (this.data.questions && this.data.questions.length > 0) {
        this.questions.clear();
        this.data.questions.forEach(qa => {
          this.questions.push(this.fb.group({
            question: qa.question,
            answer: qa.answer
          }));
        });
      }
    }
  }
  
  selectMood(value: number): void {
    this.diaryForm.patchValue({ mood: value });
  }
  
  initializeQuestionsFormArray(): void {
    this.predefinedQuestions.forEach(question => {
      this.questions.push(this.fb.group({
        question: question,
        answer: ['']
      }));
    });
  }
  
  getQuestionText(index: number): string {
    const questionControl = this.questions.at(index).get('question');
    return questionControl ? questionControl.value : '';
  }
  
  addFeeling(event: any): void {
    const value = (event.value || '').trim();
    if (value) {
      this.feelings.push(value);
      this.diaryForm.get('feelings')?.setValue(this.feelings);
    }
    if (event.input) {
      event.input.value = '';
    }
  }
  
  removeFeeling(feeling: string): void {
    const index = this.feelings.indexOf(feeling);
    if (index >= 0) {
      this.feelings.splice(index, 1);
      this.diaryForm.get('feelings')?.setValue(this.feelings);
    }
  }
  
  addActivity(event: any): void {
    const value = (event.value || '').trim();
    if (value) {
      this.activities.push(value);
      this.diaryForm.get('activities')?.setValue(this.activities);
    }
    if (event.input) {
      event.input.value = '';
    }
  }
  
  removeActivity(activity: string): void {
    const index = this.activities.indexOf(activity);
    if (index >= 0) {
      this.activities.splice(index, 1);
      this.diaryForm.get('activities')?.setValue(this.activities);
    }
  }
  
  onSubmit(): void {
    if (this.diaryForm.invalid) return;
    
    this.isSubmitting = true;
    
    const formValues = this.diaryForm.value;
    
    const questions = formValues.questions
      .filter((q: any) => q.answer && q.answer.trim() !== '')
      .map((q: any) => ({
        question: q.question,
        answer: q.answer
      }));
    
    this.authService.currentUser$.pipe(
      switchMap(user => {
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        const entryData = {
          userId: user.id,
          content: formValues.content,
          mood: formValues.mood,
          feelings: this.feelings,
          activities: this.activities,
          questions: questions,
          createdAt: new Date()
        };
        
        if (this.isEditMode && this.data) {
          return this.diaryService.updateEntry(this.data.id, entryData);
        } else {
          return this.diaryService.addEntry(entryData);
        }
      })
    ).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.snackBar.open(
          this.isEditMode ? 'Entrada atualizada com sucesso!' : 'Entrada adicionada com sucesso!',
          'Fechar',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error saving diary entry:', error);
        this.snackBar.open(
          'Erro ao salvar entrada. Por favor, tente novamente.',
          'Fechar',
          { duration: 5000 }
        );
      }
    });
  }
}
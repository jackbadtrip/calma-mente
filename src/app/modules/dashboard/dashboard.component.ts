import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { DiaryService } from '../../core/services/diary.service';

@Component({
  selector: 'cm-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    NgChartsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  moodData: { date: string, mood: number }[] = [];
  
  entriesCount = 12;
  averageMood = 3.8;
  meditationMinutes = 45;
  journalStreak = 3;
  
  public moodChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  
  public moodChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Nível de Humor',
        backgroundColor: 'rgba(93, 169, 233, 0.2)',
        borderColor: 'rgba(93, 169, 233, 1)',
        pointBackgroundColor: 'rgba(93, 169, 233, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(93, 169, 233, 1)',
        fill: 'origin',
      }
    ]
  };
  
  public activityChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      }
    }
  };
  
  public activityChartData: ChartData<'doughnut'> = {
    labels: ['Respiração', 'Meditação', 'Alongamento', 'Diário'],
    datasets: [
      {
        data: [8, 5, 3, 12],
        backgroundColor: [
          'rgba(93, 169, 233, 0.8)',
          'rgba(245, 143, 160, 0.8)',
          'rgba(41, 80, 127, 0.8)',
          'rgba(152, 202, 237, 0.8)'
        ],
      }
    ]
  };
  
  constructor(private diaryService: DiaryService) { }
  
  ngOnInit(): void {
    this.loadMoodData();
  }
  
  loadMoodData(): void {
    this.diaryService.getWeeklyMoodData().subscribe({
      next: (data) => {
        this.moodData = data;
        this.updateMoodChart();
        this.calculateStats();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading mood data:', error);
        this.isLoading = false;
      }
    });
  }
  
  updateMoodChart(): void {
    if (this.moodData.length > 0) {
      const labels = this.moodData.map(d => d.date);
      const data = this.moodData.map(d => d.mood);
      
      this.moodChartData = {
        labels: labels,
        datasets: [
          {
            data: data,
            label: 'Nível de Humor',
            backgroundColor: 'rgba(93, 169, 233, 0.2)',
            borderColor: 'rgba(93, 169, 233, 1)',
            pointBackgroundColor: 'rgba(93, 169, 233, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(93, 169, 233, 1)',
            fill: 'origin',
          }
        ]
      };
    }
  }
  
  calculateStats(): void {
    if (this.moodData.length > 0) {
      this.entriesCount = this.moodData.length;
      
      const sum = this.moodData.reduce((total, current) => total + current.mood, 0);
      this.averageMood = sum / this.moodData.length;
      
      this.journalStreak = Math.min(this.moodData.length, 7);
    }
  }
}
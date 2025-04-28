import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from, map, switchMap } from 'rxjs';
import { DiaryEntry } from '../models/diary-entry.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  addEntry(entry: Omit<DiaryEntry, 'id'>): Observable<string> {
    const entriesCollection = collection(this.firestore, 'diary-entries');
    return from(addDoc(entriesCollection, {
      ...entry,
      createdAt: new Date()
    })).pipe(
      map(docRef => docRef.id)
    );
  }

  getEntries(): Observable<DiaryEntry[]> {
    return this.authService.currentUser$.pipe(
      map(user => user?.id || ''),
      map(userId => {
        if (!userId) return [];
        
        const entriesQuery = query(
          collection(this.firestore, 'diary-entries'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        
        return from(getDocs(entriesQuery)).pipe(
          map(snapshot => {
            return snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            } as DiaryEntry));
          })
        );
      }),
      
      switchMap(entries => entries)
    );
  }

  updateEntry(id: string, data: Partial<DiaryEntry>): Observable<void> {
    const entryDoc = doc(this.firestore, 'diary-entries', id);
    return from(updateDoc(entryDoc, { ...data }));
  }

  deleteEntry(id: string): Observable<void> {
    const entryDoc = doc(this.firestore, 'diary-entries', id);
    return from(deleteDoc(entryDoc));
  }

  getWeeklyMoodData(): Observable<{ date: string, mood: number }[]> {
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return this.authService.currentUser$.pipe(
      map(user => user?.id || ''),
      map(userId => {
        if (!userId) return [];
        
        const entriesQuery = query(
          collection(this.firestore, 'diary-entries'),
          where('userId', '==', userId),
          where('createdAt', '>=', oneWeekAgo),
          orderBy('createdAt', 'asc')
        );
        
        return from(getDocs(entriesQuery)).pipe(
          map(snapshot => {
            return snapshot.docs.map(doc => {
              const data = doc.data() as DiaryEntry;
              const date = new Date(data.createdAt.seconds * 1000);
              return {
                date: date.toLocaleDateString('pt-BR'),
                mood: data.mood
              };
            });
          })
        );
      }),
      
      switchMap(entries => entries)
    );
  }
}
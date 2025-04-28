import { Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  UserCredential,
  authState 
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  
  private authErrorSubject = new BehaviorSubject<string | null>(null);
  authError$ = this.authErrorSubject.asObservable();
  
  isLoggedIn$: Observable<boolean>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.isLoggedIn$ = authState(this.auth).pipe(
      map(user => !!user)
    );
    
    authState(this.auth).pipe(
      switchMap(firebaseUser => {
        if (firebaseUser) {
          return this.getUserData(firebaseUser.uid).pipe(
            map(userData => ({
              ...userData,
              id: firebaseUser.uid,
              email: firebaseUser.email || ''
            }))
          );
        } else {
          return of(null);
        }
      })
    ).subscribe(user => {
      this.currentUserSubject.next(user);
    });
  }

  signup(email: string, password: string, name: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      tap(() => {
        this.router.navigate(['/']);
      }),
      switchMap(userCredential => {
        const userData: User = {
          id: userCredential.user.uid,
          email: email,
          name: name,
          createdAt: new Date()
        };
        
        return from(setDoc(doc(this.firestore, 'users', userCredential.user.uid), userData)).pipe(
          map(() => {
            this.currentUserSubject.next(userData);
            return userCredential;
          })
        );
      }),
      catchError(error => {
        this.authErrorSubject.next(this.handleAuthError(error));
        throw error;
      })
    );
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      tap(() => {
        this.router.navigate(['/']);
      }),
      catchError(error => {
        this.authErrorSubject.next(this.handleAuthError(error));
        throw error;
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
        this.router.navigate(['/']);
      }),
      catchError(error => {
        this.authErrorSubject.next('Erro ao sair do sistema');
        throw error;
      })
    );
  }

  private getUserData(userId: string): Observable<any> {
    const userDoc = doc(this.firestore, 'users', userId);
    return from(getDoc(userDoc)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          return docSnap.data();
        } else {
          return null;
        }
      })
    );
  }

  private handleAuthError(error: any): string {
    console.error('Auth error:', error);
    
    switch(error.code) {
      case 'auth/email-already-in-use':
        return 'Este e-mail já está em uso';
      case 'auth/invalid-email':
        return 'E-mail inválido';
      case 'auth/weak-password':
        return 'Senha muito fraca';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'E-mail ou senha incorretos';
      default:
        return 'Ocorreu um erro durante a autenticação';
    }
  }
}
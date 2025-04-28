export interface DiaryEntry {
  id: string;
  userId: string;
  content: string;
  mood: number;
  activities: string[];
  feelings: string[];
  createdAt: any;
  questions?: {
    question: string;
    answer: string;
  }[];
}
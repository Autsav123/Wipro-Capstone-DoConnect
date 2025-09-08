import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:5193/api/QuestionApi';

  constructor(private http: HttpClient) { }
  getAll(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);
  }
  getById(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/${id}`);
  } 
  create(question: Question): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, question);
  }
  update(id: number, question: Question): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, question);
  }
  updateQuestion(question: Question) {
  return this.http.put(`http://localhost:5193/api/QuestionApi/${question.questionId}`, question);
}
// delete(id: number): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/${id}`,);
//   } 
softDeleteQuestion(id: number) {
  return this.http.post(`http://localhost:5193/api/QuestionApi/soft-delete/${id}`, {});
}
  getPendingQuestions() {
    return this.http.get<any[]>(`${this.apiUrl}/pending` );
  }
  getApprovedQuestions() {
    return this.http.get<any[]>(`${this.apiUrl}/approved`);
  }
  approveQuestion(questionId: number) {
    return this.http.post(`${this.apiUrl}/approve/${questionId}`, {});
  }
  rejectQuestion(questionId: number) {
    return this.http.post(`${this.apiUrl}/reject/${questionId}`, {});
  }
  addAnswer(questionId: number, answer: string) {
    return this.http.post(`${this.apiUrl}/add-answer`, { questionId, answerText: answer });
  }
  addQuestion(question: Question) {
  return this.http.post(`${this.apiUrl}/add-question`, question);
  }
  searchQuestions(query: string) {
  return this.http.get<any[]>(`http://localhost:5193/api/QuestionApi/search?query=${encodeURIComponent(query)}`);
} 
uploadQuestionImage(questionId: number, file: File) {
  const formData = new FormData();
  formData.append('questionId', questionId.toString());
  formData.append('file', file);
  return this.http.post<{imageId: number, imagePath: string}>(
    'http://localhost:5193/api/ImageApi/upload', formData
  );
}

getImagesForQuestion(questionId: number) {
  return this.http.get<{imageId: number, imagePath: string}[]>(
    'http://localhost:5193/api/ImageApi/byquestion/${questionId}'
);
}
}

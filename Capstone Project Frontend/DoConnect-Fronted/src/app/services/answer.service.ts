import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Answer  }  from '../models/answer.model';
@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  private apiUrl = 'http://localhost:5193/api/AnswerApi';

  constructor(private http: HttpClient) {  }

  getAll(): Observable<Answer[]> {
    return this.http.get<Answer[]>(this.apiUrl);
  }

  getById(id: number): Observable<Answer> {
    return this.http.get<Answer>(`${this.apiUrl}/${id}`);
  }

  create(answer: Answer): Observable<Answer> {
    return this.http.post<Answer>(this.apiUrl, answer);
  }

  update(id: number, answer: Answer): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, answer);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  addAnswer(answer: any) {
  return this.http.post('http://localhost:5193/api/AnswerApi/add-answer', answer);
}

getAnswersForQuestion(questionId: number) {
  return this.http.get<any[]>(`http://localhost:5193/api/AnswerApi/answers-by-question/${questionId}`);
}
getPendingAnswers() {
    return this.http.get<Answer[]>(`${this.apiUrl}/pending`);
  }

  approveAnswer(id: number) {
    return this.http.post(`${this.apiUrl}/approve/${id}`, {});
  }

  rejectAnswer(id: number) {
    return this.http.post(`${this.apiUrl}/reject/${id}`, {});
  }
}
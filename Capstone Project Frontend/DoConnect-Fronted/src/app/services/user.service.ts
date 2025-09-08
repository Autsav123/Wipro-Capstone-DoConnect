import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5193/api/UserApi';

  constructor(private http: HttpClient) {}

  login(user: {username: string, password: string}): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user);
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl); // GET /api/UserApi
  }

  delete(id: number): Observable<any> {
    // DELETE /api/UserApi/{id}
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
}
getAllUsers() {
  return this.http.get<any[]>('http://localhost:5193/api/UserApi/GetAllUsers');
}
approveUser(id: number) {
  return this.http.post('http://localhost:5193/api/UserApi/ApproveUser', { id });
}
rejectUser(id: number) {
  return this.http.post('http://localhost:5193/api/UserApi/RejectUser', { id });
}
}
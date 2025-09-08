import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Answer } from '../../models/answer.model';
import { AnswerService } from '../../services/answer.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: [ './admin-dashboard.component.css'],
  standalone: false
})
export class AdminDashboardComponent implements OnInit {
  pendingQuestions: any[] = [];
  pendingAnswers:Answer[]=[];
  processingQuestions = new Set<number>();
  processingAnswers:Set<number> = new Set();
  totalQuestions = 0;
  approvedQuestions = 0;
  totalUsers = 0;

  constructor(private questionService: QuestionService,private answerService:AnswerService) {}

  // Role check (case-sensitively admin match karo)
  isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'Admin';
  }

  ngOnInit() {
    // Load all dashboard data when component initializes
    this.loadPendingQuestions();
    this.loadDashboardStats();
    this.loadPendingAnswers();
  }

  loadPendingQuestions() {
    this.questionService.getPendingQuestions().subscribe({
      next: (questions) => {
          console.log("Pending Questions:", questions);
          this.pendingQuestions = questions;
      },
      error: () => {
          console.error("Failed to load pending questions");
          this.pendingQuestions = [];
      }
    });
  }
  loadPendingAnswers() {
  this.answerService.getPendingAnswers().subscribe(ans => this.pendingAnswers = ans);
}

approveAnswer(id: number) {
  this.processingAnswers.add(id);
  this.answerService.approveAnswer(id).subscribe(() =>{ 
    this.processingAnswers.delete(id);
    this.loadPendingAnswers()});
}

rejectAnswer(id: number) {
  this.processingAnswers.add(id);
  this.answerService.rejectAnswer(id).subscribe(()=>{
    this.processingAnswers.delete(id);
    this.loadPendingAnswers()
  });
}

  loadDashboardStats() {
    // Load total questions
    this.questionService.getAll().subscribe({
      next: (questions) => {
        this.totalQuestions = questions.length;
        this.approvedQuestions = questions.filter(q => q.status === 'approved').length;
      },
      error: () => {
        console.error("Failed to load question stats");
      }
    });

    // For now, set a placeholder for total users
    // In a real app, you'd call a user service
    this.totalUsers = 50; // Placeholder
  }

  getTotalQuestions(): number {
    return this.totalQuestions;
  }

  getApprovedQuestions(): number {
    return this.approvedQuestions;
  }

  getTotalUsers(): number {
    return this.totalUsers;
  }

  approveQuestion(id: number) {
    this.processingQuestions.add(id);
    this.questionService.approveQuestion(id).subscribe({
      next: () => {
        this.processingQuestions.delete(id);
        this.loadPendingQuestions();
        this.loadDashboardStats();
      },
      error: () => {
        this.processingQuestions.delete(id);
        console.error("Failed to approve question");
      }
    });
  }

  rejectQuestion(id: number) {
    this.processingQuestions.add(id);
    this.questionService.rejectQuestion(id).subscribe({
      next: () => {
        this.processingQuestions.delete(id);
        this.loadPendingQuestions();
        this.loadDashboardStats();
      },
      error: () => {
        this.processingQuestions.delete(id);
        console.error("Failed to reject question");
      }
    });
  }
}
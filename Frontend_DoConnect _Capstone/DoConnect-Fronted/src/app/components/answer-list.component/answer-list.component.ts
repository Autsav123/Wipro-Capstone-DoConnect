import { Component, OnInit, Input } from '@angular/core';
import { AnswerService } from '../../services/answer.service';
import { Answer } from '../../models/answer.model';

@Component({
  selector: 'app-answer-list',
  standalone: false,
  templateUrl: './answer-list.component.html',
  styleUrls: ['./answer-list.component.css'] // Typo fixed: styleUrls
})
export class AnswerListComponent implements OnInit {
  @Input() questionId!: number;
  answers: Answer[] = [];
  processingAnswers = new Set<number>(); // Added for processing state

  constructor(private answerService: AnswerService) {}

  ngOnInit() {
    this.loadAnswers();
  }

  loadAnswers() {
    if (this.questionId !== undefined) {
      this.answerService.getAll().subscribe({
        next: (data) => {
          this.answers = data.filter(a => a.questionId === this.questionId);
        },
        error: (error) => {
          console.error('Failed to load answers:', error);
          this.answers = [];
        }
      });
    } else {
      this.answerService.getAll().subscribe({
        next: (data) => {
          this.answers = data;
        },
        error: (error) => {
          console.error('Failed to load answers:', error);
          this.answers = [];
        }
      });
    }
  }

  // TrackBy function for better performance
  trackByAnswerId(_index: number, answer: Answer): number {
    return answer.answerId;
  }
  approveAnswer(id: number) {
    this.processingAnswers.add(id);
    this.answerService.approveAnswer(id).subscribe({
      next: () => {
        this.loadAnswers();
        this.processingAnswers.delete(id);
        console.log(`Answer ${id} approved successfully`);
      },
      error: (error) => {
        this.processingAnswers.delete(id);
        console.error('Failed to approve answer:', error);
        alert('Failed to approve answer. Please try again.');
      }
    });
  }

  rejectAnswer(id: number) {
    this.processingAnswers.add(id);
    this.answerService.rejectAnswer(id).subscribe({
      next: () => {
        this.loadAnswers();
        this.processingAnswers.delete(id);
        console.log(`Answer ${id} rejected successfully`);
      },
      error: (error) => {
        this.processingAnswers.delete(id);
        console.error('Failed to reject answer:', error);
        alert('Failed to reject answer. Please try again.');
      }
    });
  }

  isAdmin() {

    return localStorage.getItem('userRole') === 'Admin';
  }

  deleteAnswer(id: number | undefined) {
    if (id !== undefined && this.isAdmin()) {
      if (confirm('Are you sure you want to delete this answer? This action cannot be undone.')) {
        this.answerService.delete(id).subscribe({
          next: () => {
            this.answers = this.answers.filter(a => a.answerId !== id);
            console.log(`Answer ${id} deleted successfully`);
          },
          error: (error) => {
            console.error('Failed to delete answer:', error);
            alert('Failed to delete answer. Please try again.');
          }
        });
      }
    }
  }

  editAnswer(answer: Answer) {
    if (answer.answerId !== undefined && this.isAdmin()) {
      // Edit logic here (modal/page/etc)
      alert('Edit logic for answer ' + answer.answerId);
    }
  }
}
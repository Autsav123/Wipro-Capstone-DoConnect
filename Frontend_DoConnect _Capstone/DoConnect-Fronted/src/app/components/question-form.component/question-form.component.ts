import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import {Question} from '../../models/question.model';
@Component({
  selector: 'app-question-form.component',
  standalone: false,
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.css'
})
export class QuestionFormComponent implements OnInit {
  questionText = '';
  userId: number = 1; // Default fallback
  submitted = false;
  loading = false;
  errorMsg = '';
  selectedFiles: File[] = [];

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    // Get userId from localStorage (set during login)
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
    } else {
      console.warn('No userId found in localStorage, using default value');
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  createQuestion() {
    this.errorMsg = '';
    this.submitted = false;

    if (this.questionText.trim() === '') {
      this.errorMsg = 'Please enter a question';
      return;
    }

    this.loading = true;

    const question = {
      questionId: 0,
      questionText: this.questionText.trim(),
      userId: this.userId,
      status: 'pending'
    };

    this.questionService.create(question).subscribe({
      next: () => {
        this.submitted = true;
        this.loading = false;
        this.questionText = '';

        // Reset form after 3 seconds
        setTimeout(() => {
          this.submitted = false;
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Failed to submit question. Please try again.';
      }
    });
  }
  
}

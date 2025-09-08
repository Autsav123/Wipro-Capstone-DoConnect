import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';
import { AnswerService } from '../../services/answer.service';
@Component({
  selector: 'app-question-list',
  standalone: false,
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})

export class QuestionListComponent implements OnInit {
  questions: Question[] = [];
  answers:{[questionId: number]: string} = {};
  questionAnswers:{[questionId: number]: any[]} = {};
  userId: number = 1; // Default fallback
  approvedQuestions: any[] = [];
  newAnswer: {[id: number]: string} = {};
  editingQuestion: Question | null = null;
uploadInProgress :boolean= false;
  uploadingForQuestionId?: number;
currentUploadQuestionId?: number;
  constructor(private questionService: QuestionService, private answerService: AnswerService)
  {}

  ngOnInit() {
    // Get userId from localStorage (set during login)
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
    } else {
      console.warn('No userId found in localStorage, using default value');
    }

    this.loadApproved();
    this.loadQuestions();
    this.questionService.getAll().subscribe(data => this.questions = data);
  }
  loadQuestions() {
    this.questionService.getAll().subscribe(qs => {this.questions = qs.filter(q => q.status !== 'deleted ' &&  q.status !== 'rejected '); 
    this.questions.forEach(q => this.loadAnswers(q.questionId));
    });
    
  }
  loadAnswers(questionId: number) {
    this.answerService.getAnswersForQuestion(questionId).subscribe(data => {
      this.questionAnswers[questionId] = data;
    });
  }
  submitAnswer(questionId: number) {
    const answerText = this.answers[questionId]?.trim();
    if (!answerText) return;

    const answerObj = {
      questionId,
      answerText,
      userId: this.userId
    };

    this.answerService.addAnswer(answerObj).subscribe(() => {
      this.answers[questionId] = '';
      this.loadAnswers(questionId); // Refresh answer list after submit
});
}
selectedFile: File | null = null;

onFileSelected(event: any, questionId: number) {
  const files = event.target.files;
  if (files && files.length > 0) {
    this.selectedFile = files[0]; // Get the first file
    this.currentUploadQuestionId = questionId;
  }
}

uploadImage(questionId: number) {
  if (!this.selectedFile) return;

  this.uploadInProgress = true;
  this.uploadingForQuestionId = questionId;

  this.questionService.uploadQuestionImage(questionId, this.selectedFile)
    .subscribe({
      next: () => {
        // refresh current question's images
        this.loadQuestions();
        this.selectedFile = null;
        this.uploadInProgress = false;
        this.uploadingForQuestionId = undefined;
      },
      error: (error) => {
        console.error('Upload failed:', error);
        this.uploadInProgress = false;
        this.uploadingForQuestionId = undefined;
        alert('Image upload failed. Please try again.');
      }
    });
}
  // SAVE EDITED QUESTION
  saveEditedQuestion() {
    if (this.editingQuestion) {
      this.questionService.updateQuestion(this.editingQuestion).subscribe({
        next: () => {
          this.editingQuestion = null;
          this.loadQuestions();
        },
        error: () => {
          alert('Update failed!');
        }
      });
    }
  }

  // CANCEL EDIT
  cancelEdit() {
    this.editingQuestion = null;
  }

  isEditMode(question: Question) {
    return this.editingQuestion != null && this.editingQuestion.questionId === question.questionId;
  }

  approveQuestion(id: number) {
    this.questionService.approveQuestion(id).subscribe(() => this.loadQuestions());
  }

  rejectQuestion(id: number) {
    this.questionService.rejectQuestion(id).subscribe(() => this.loadQuestions());
  }

  loadApproved() {
    this.questionService.getApprovedQuestions().subscribe(q => this.approvedQuestions = q);
  }
  add(id: number) {
    this.questionService.addAnswer(id, this.newAnswer[id]).subscribe(() => {
      this.loadApproved();
      this.newAnswer[id] = '';
    });
  }



  isAdmin() {
    return localStorage.getItem('userRole') === 'Admin';
  }

  deleteQuestion(id: number) {
    if (this.isAdmin()) {
      this.questionService.softDeleteQuestion(id).subscribe({
        next: () => {
          // Reload list after delete
          this.questions = this.questions.filter(q => q.questionId !== id);
          alert('Question deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting question:', err);
          alert('Failed to delete question.');
        }
      });
    }
  }

  viewImage(imagePath: string) {
    // Open image in a new window/tab
    window.open(imagePath, '_blank');
  }

  editQuestion(question: Question) {
    if (this.isAdmin()) {
        this.editingQuestion = { ...question };
      alert('Edit logic for question ' + question.questionId);
    }
  }

  getStatusBadgeClass(status?: string): string {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'rejected':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }
}
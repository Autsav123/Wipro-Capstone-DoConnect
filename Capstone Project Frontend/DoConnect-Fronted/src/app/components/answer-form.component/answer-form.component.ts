import { Component, Input } from '@angular/core';
import { AnswerService } from '../../services/answer.service';
import { Answer } from '../../models/answer.model';



@Component({
  selector: 'app-answer-form',
  standalone: false,
  templateUrl: './answer-form.component.html',
  styleUrl: './answer-form.component.css'
})
export class AnswerFormComponent {
  @Input() questionId!: number; // Parent se questionId mile
  answerText = '';
  userId = 1; // Set by auth/user context
  submitted = false;

  constructor(private answerService: AnswerService) {}

  submitAnswer() {
    if (this.answerText.trim() && this.questionId) {
      const answer: Answer = {
        answerId: 0,
        answerText: this.answerText,
        questionId: this.questionId,
        userId: this.userId,
        status: 'pending'
      };
      console.log('Submitting answer payload:', answer);
      this.answerService.create(answer).subscribe({
        next: () => {
          this.submitted = true;
          this.answerText = '';
        },
        error: err => {
          console.log(' submitting answer Error:', err);
          alert('Failed to submit answer!');
        }
      });
    }
  }
}
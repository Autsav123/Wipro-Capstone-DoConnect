import { Component } from '@angular/core';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-search-question',
  standalone: false,
  templateUrl: './search-question.component.html',
  styleUrl: './search-question.component.css'
})
export class SearchQuestionComponent {
  searchText: string = '';
  searchResults: any[] = [];
  loading = false;
  errorMsg = '';

  constructor(private questionService: QuestionService) {}

  onSearch() {
    if (!this.searchText.trim()) {
      this.searchResults = [];
      this.errorMsg = '';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.questionService.searchQuestions(this.searchText).subscribe({
      next: (res) => {
        this.searchResults = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Search error:', err);
        this.errorMsg = "Unable to search questions. Please try again.";
        this.searchResults = [];
        this.loading = false;
      }
    });
  }

  trackByQuestionId(index: number, question: any): any {
    return question.id || question.questionId || index;
  }

  clearSearch() {
    this.searchText = '';
    this.searchResults = [];
    this.errorMsg = '';
  }
}

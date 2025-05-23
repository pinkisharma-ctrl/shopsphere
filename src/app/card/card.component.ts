import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule,MatButtonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent implements OnInit {
  questionData: any;
  selectedOptionIndex: number | null = null;
  filteredQuestions: any[] = [];
  currentIndex: number = 0;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (typeof window !== 'undefined' && localStorage) {
      const data = localStorage.getItem('questionData');
      if (data) {
        const parsedData = JSON.parse(data);
        const selectedQuestion = parsedData.find((q: any) => q.id === id);

        if (selectedQuestion) {
          const category = selectedQuestion.category;
          const sameCategoryQuestions = parsedData.filter((q: any) => q.category === category);
          const reordered = sameCategoryQuestions.filter((q: any) => q.id !== id);
          this.filteredQuestions = [selectedQuestion, ...reordered];
          this.currentIndex = 0;
          this.setQuestionData();
        }
      }
    }
  }

  setQuestionData(): void {
    this.selectedOptionIndex = null; // Reset option selection on change
    this.questionData = this.filteredQuestions[this.currentIndex];
  }

  next(): void {
    if (this.currentIndex < this.filteredQuestions.length - 1) {
      this.currentIndex++;
      this.setQuestionData();
    }
  }

  previous(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.setQuestionData();
    }
  }

  selectOption(index: number): void {
    this.selectedOptionIndex = index;
  }

  getOptionClass(index: number): string {
    if (this.selectedOptionIndex === null) return '';
    if (index === this.selectedOptionIndex) {
      return index === this.questionData.correctOptionIndex ? 'correct' : 'wrong';
    }
    return '';
  }

  getDifficultyColorClass(difficulty: string): string {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'easy';
      case 'medium': return 'medium';
      case 'hard': return 'hard';
      default: return '';
    }
  }
 
  addToFav(data: any): void {
  const localData = localStorage.getItem('questionData');
  if (!localData) return;

  const questions = JSON.parse(localData);

  // Toggle the isFavourite value
  const index = questions.findIndex((q: any) => q.id === data.id);
  if (index !== -1) {
    questions[index].isFavourite = !questions[index].isFavourite;

    // Update the UI object as well (this will reflect the class change)
    data.isFavourite = questions[index].isFavourite;

    // Save updated list to localStorage
    localStorage.setItem('questionData', JSON.stringify(questions));
  }
}


}

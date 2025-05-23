import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favourite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss']
})
export class FavouriteComponent implements OnInit {
  favouriteQuestions: any[] = [];
  ngOnInit(): void {
    const data = localStorage.getItem('questionData');
    if (data) {
      this.favouriteQuestions = JSON.parse(data).filter((res:any)=>{
       return  res.isFavourite
      });
    }
  }

  getDifficultyColorClass(difficulty: string): string {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'easy';
      case 'medium': return 'medium';
      case 'hard': return 'hard';
      default: return '';
    }
  }

  removeFromFavourites(data: any): void {
      const localData = localStorage.getItem('questionData');
    if (!localData) return;
    const questions = JSON.parse(localData);
    const index = questions.findIndex((q: any) => q.id === data.id);
    if (index !== -1) {
      questions[index].isFavourite = !questions[index].isFavourite;
      data.isFavourite = questions[index].isFavourite;
      localStorage.setItem('questionData', JSON.stringify(questions));
        this.favouriteQuestions = questions.filter((q: any) => q.isFavourite);
    }
  }

}

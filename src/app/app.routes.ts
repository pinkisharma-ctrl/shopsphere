import { Routes } from '@angular/router';
import { QuestionFormComponent } from './question-form/question-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CardComponent } from './card/card.component';
import { FavouriteComponent } from './favourite/favourite.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'create', component: QuestionFormComponent },
    { path: 'card/:id', component: CardComponent },
    { path: 'favourite', component: FavouriteComponent },

    
];

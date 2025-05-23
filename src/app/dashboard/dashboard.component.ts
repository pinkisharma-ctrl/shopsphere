import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    FormsModule,
    MatSortModule,
    MatCardModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  displayedColumns: string[] = [ 'question', 'category' ,'subcategory', 'difficulty', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  filteredDataSource = new MatTableDataSource<any>([]);

  selectedCategory = '';
  selectedDifficulty = '';
  selectedSubcategory = '';

  uniqueCategories :any;
  uniqueDifficulties :any;
  uniqueSubcategories :any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public _router :Router) {
    const storedData = localStorage.getItem('questionData');
    const parsedData = storedData ? JSON.parse(storedData) : [];

    this.dataSource.data = parsedData;
    this.filteredDataSource.data = parsedData;

    this.uniqueCategories = [...new Set(parsedData.map((item: any) => item.category))];
    this.uniqueDifficulties = [...new Set(parsedData.map((item: any) => item.difficulty))];
    this.uniqueSubcategories = [...new Set(parsedData.map((item: any) => item.subcategory))];
  }

  ngAfterViewInit() {
    this.filteredDataSource.paginator = this.paginator;
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Easy': return 'chip-easy';
      case 'Medium': return 'chip-medium';
      case 'Hard': return 'chip-hard';
      default: return '';
    }
  }

  onView(row: any) {
      this._router.navigate(['/card', row.id]);
  }

  onDelete(row: any) {
    this.dataSource.data = this.dataSource.data.filter(item => item !== row);
    this.filteredDataSource.data = this.filteredDataSource.data.filter(item => item !== row);
    localStorage.setItem('questionData', JSON.stringify(this.dataSource.data));
  }

  applyFilter() {
    this.filteredDataSource.data = this.dataSource.data.filter(item => {
      return (
        (this.selectedCategory === '' || item.category === this.selectedCategory) &&
        (this.selectedDifficulty === '' || item.difficulty === this.selectedDifficulty) &&
        (this.selectedSubcategory === '' || item.subcategory === this.selectedSubcategory)
      );
    });

    this.filteredDataSource.paginator = this.paginator;
  }
}

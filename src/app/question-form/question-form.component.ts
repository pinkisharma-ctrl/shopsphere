import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.scss'
})
export class QuestionFormComponent {
  questionForm: FormGroup;

  // Default image (replace with actual dynamic image logic if needed)
  img = 'https://sdmntpreastus.oaiusercontent.com/files/00000000-44f4-61f9-b74d-0cdff257511c/raw?se=2025-05-22T05%3A43%3A34Z&sp=r&sv=2024-08-04&sr=b&scid=1aad4dce-fb53-563c-8a0a-27e2a602f52b&skoid=31bc9c1a-c7e0-460a-8671-bf4a3c419305&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-21T20%3A39%3A40Z&ske=2025-05-22T20%3A39%3A40Z&sks=b&skv=2024-08-04&sig=CigpiNuMLI%2Bhb4DraErL9PfsWNgcT7QJWBnneZz/w4A%3D';


  constructor(private fb: FormBuilder) {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      correctAnswers: this.fb.array([
        this.fb.control(false),
        this.fb.control(false),
        this.fb.control(false),
        this.fb.control(false)
      ]),
      title: ['', Validators.required],
      difficulty: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required]
    });
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  get correctAnswers(): FormArray {
    return this.questionForm.get('correctAnswers') as FormArray;
  }

  // Ensure only one checkbox can be selected
  selectCorrect(index: number): void {
    this.correctAnswers.controls.forEach((control, i) => {
      control.setValue(i === index);
    });
  }

  async onSubmit(): Promise<void> {
    //if (this.questionForm.invalid) return;

    try {
      const formValue = this.questionForm.value;
      const newEntry = {
        img: this.img,
        question:formValue.question,
        options: formValue.options,
        correctOptionIndex: formValue.correctAnswers.findIndex((v: boolean) => v),
        difficulty: formValue.difficulty,
        category:formValue.category,
        subcategory:formValue.subcategory
      };
      const localData = localStorage.getItem('questionData');
      const data: any[] = localData ? JSON.parse(localData) : [];
      data.push(newEntry);
      localStorage.setItem('questionData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }
}

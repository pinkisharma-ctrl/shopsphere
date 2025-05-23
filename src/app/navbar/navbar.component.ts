import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(public _router: Router){}

  createForm(){
      this._router.navigate(['/create']);
  }

  goToFavourite(){
      this._router.navigate(['/favourite']);
  }
}

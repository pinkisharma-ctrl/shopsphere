import { CommonModule } from '@angular/common';
import { Component ,Renderer2} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    isDarkMode = false;

  constructor(public _router: Router,private renderer: Renderer2){}

ngOnInit(){
  const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      this.renderer.addClass(document.body, 'dark-theme');
      this.isDarkMode = true;
    }
}

 toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  createForm(){
      this._router.navigate(['/create']);
  }

  goToFavourite(){
      this._router.navigate(['/favourite']);
  }
}

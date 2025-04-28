import { Component } from '@angular/core';

@Component({
  selector: 'app-remote-entry',
  template: `<div class="remote-entry">
               <h2>👋 Hello from Remote Entry Component (MFE1)!</h2>
             </div>`,
  styles: [` 
    .remote-entry {
      padding: 20px;
      background-color: #f3f4f6;
      border-radius: 8px;
      text-align: center;
    }
  `],
  standalone: true,  // Marking this component as standalone
})
export class RemoteEntryComponent {}

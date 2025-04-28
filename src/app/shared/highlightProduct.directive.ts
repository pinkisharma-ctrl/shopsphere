import { Directive, Input, ElementRef } from "@angular/core";

@Directive({
    selector: '[highlightProduct]'
  })
  export class HighlightProductDirective {
    @Input() set highlightProduct(price: number) {
      this.el.nativeElement.style.border = price > 100 ? '1px solid #cccccc' : '1px solid #f4f4f4';
    }
  
    constructor(private el: ElementRef) {}
  }
  
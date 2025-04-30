import { Directive, Input, ElementRef } from "@angular/core";

@Directive({
    selector: '[highlightProduct]'
  })
  export class HighlightProductDirective {
    @Input() set highlightProduct(count: number) {

      this.el.nativeElement.style.border = count < 100 ? '1px solid #f75f87' : (count  < 150 ?  '1px solid #ffeec5' : '1px solid #fffffff' );
    }
  
    constructor(private el: ElementRef) {}
  }
  
// src/app/shared/pipes/category-map.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryMap'
})
export class CategoryMapPipe implements PipeTransform {
  transform(value: string): string {
    const categoryMap: { [key: string]: string } = {
      jewelry: "jewelery",
      men: "men's clothing",
      electronics: "electronics",
      women: "women's clothing"
    };
    return categoryMap[value.toLowerCase()] || value;
  }
}


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})

export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number): string {
    const conversionRate = 84.38; // Example rate
    const result = value * conversionRate;
    return `₹${result.toFixed(2)}`;
  }
}
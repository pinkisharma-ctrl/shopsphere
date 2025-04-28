import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currencySign: string = '₹', decimalLength: number = 2): string {
    if (isNaN(value)) return '';
    return `${currencySign}${value.toFixed(decimalLength)}`;
  }
}


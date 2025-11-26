// src/app/number-to-words.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NumberToWordsService {
  private unitsFr: string[] = [
    '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six',
    'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize',
    'quatorze', 'quinze', 'seize','dix-sept','dix-huit','dix-neuf'
  ];
  private tensFr: string[] = [
    '', '', 'vingt', 'trente', 'quarante', 'cinquante',
    'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'
  ];

  private unitsEn: string[] = [
    'zero', 'one', 'two', 'three', 'four', 'five',
    'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
    'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
    'seventeen', 'eighteen', 'nineteen'
  ];
  private tensEn: string[] = [
    '', '', 'twenty', 'thirty', 'forty', 'fifty',
    'sixty', 'seventy', 'eighty', 'ninety'
  ];

  constructor() {}

  public convertNumberToWords(num: number, lang: string): string {
    const units = lang === 'fr' ? this.unitsFr : this.unitsEn;
    const tens = lang === 'fr' ? this.tensFr : this.tensEn;
    if (num === 0) return units[0];
    if (num < 0) return 'minus ' + this.convertNumberToWords(-num, lang);
    let words = '';

    if (num >= 1000000000) {
      words += this.convertNumberToWords(Math.floor(num / 1000000000), lang) +
        (lang === 'fr' ? ' milliard ' : ' billion ');
      num %= 1000000000;
    }

    if (num >= 1000000) {
      words += this.convertNumberToWords(Math.floor(num / 1000000), lang) +
        (lang === 'fr' ? ' million ' : ' million ');
      num %= 1000000;
    }

    if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      if (lang === 'fr' && thousands === 1) {
        words += 'mille ';
      } else {
        words += this.convertNumberToWords(thousands, lang) +
          (lang === 'fr' ? ' mille ' : ' thousand ');
      }
      num %= 1000;
    }

    if (num >= 100) {
      const hundreds = Math.floor(num / 100);
      if (lang === 'fr' && hundreds === 1) {
        words += 'cent ';
      } else {
        words += this.convertNumberToWords(hundreds, lang) +
          (lang === 'fr' ? ' cent ' : ' hundred ');
      }
      num %= 100;
    }

    if (num > 0) {
      if (words !== '' && lang === 'en') words += 'and ';
      if (num < 20) {
        words += units[num];
      } else {
        words += tens[Math.floor(num / 10)];
        if (num % 10 > 0) {
          words += '-' + units[num % 10];
        }
      }
    }

    return words.trim();
  }
}

import { AbstractControl, ValidationErrors } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const convertStringToFormatedDate = (date: string | undefined | null): string => {
  if (date) {
      const dateFacture = new Date(date);
      // Formatage de la date en "YYYY-MM-DD"
      const formattedDate = `${dateFacture.getFullYear()}-${String(dateFacture.getMonth() + 1).padStart(2, '0')}-${String(dateFacture.getDate()).padStart(2, '0')}`

      return formattedDate
  }
  return new Date().toISOString().slice(0, 10);

}


export const convertDateFormatedDate = (date: Date): string => {
  // Get the year, month, and day components
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
  const day = date.getDate().toString().padStart(2, '0');

  // Combine the components into the desired format
  const formattedDate = year + '-' + month + '-' + day;

  return formattedDate;
}


export const exportToExcel=(data: any[], fileName: string)=> {
  // Convertir les données en une feuille Excel
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  // Créer un classeur (Workbook)
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Data': worksheet },
    SheetNames: ['Data'],
  };

  // Générer un fichier Excel à partir du classeur
  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  // Sauvegarder le fichier avec FileSaver
  saveAsFile(excelBuffer, fileName,"xlsx");

}

export const exportToCsv=(data: any[], fileName: string)=> {
  // Convertir les données en une feuille CSV
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

  // Générer un fichier CSV
  const csvBuffer: any = XLSX.write(
    { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] },
    { bookType: 'csv', type: 'array' }
  );

  // Sauvegarder le fichier CSV
  saveAsFile(csvBuffer, fileName, 'csv');
}



function saveAsFile(buffer: any, fileName: string, extension: string): void {
  const data: Blob = new Blob([buffer], {
    type: extension === 'csv' ? 'text/csv;charset=utf-8;' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(data, `${fileName}.${extension}`);
}


export function lensPowerValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) {
    return null;
  }

  // Match either "0.00" without sign or signed decimal with two digits
  const regex = /^(0\.00|[+-](?!0\.00)\d+\.\d{2})$/;

  if (!regex.test(value)) {
    return { invalidLensPower: true };
  }

  return null;
}

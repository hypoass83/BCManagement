import { AbstractControl, ValidatorFn } from '@angular/forms';
import { convertDateFormatedDate } from '../tools/tools';

export function confirmPasswordValidator(
  password: string,
  confirmPassword: string
): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
    const passwordControl = formGroup.get(password);
    const confirmPasswordControl = formGroup.get(confirmPassword);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (
      confirmPasswordControl.errors &&
      !confirmPasswordControl.errors['passwordMismatch']
    ) {
      // Return if another validator has already found an error on the confirmPasswordControl
      return null;
    }

    // Set the error on confirmPasswordControl if validation fails
    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }

    return null;
  };
}

// export const closeModal = (id_modal: string) => {
//   const modal = document.getElementById(id_modal);
//   if (modal) {
//     modal.classList.toggle('hidden');
//     const backdrop = document.querySelectorAll('[data-hs-overlay-backdrop-template]');

//     // Iterate through the NodeList and remove each element from the DOM
//     backdrop.forEach(element => {
//       element.parentNode?.removeChild(element);
//     });
//     document.body.style.overflow = "auto"
//   }
// }

export const openModal = (id: string) => {
  id = id.toLocaleLowerCase()
  document.getElementById(id)?.classList.remove('hidden');
  document.getElementById(id)?.classList.add('show_element');
};
export const closeModal = (id: string) => {
  id = id.toLocaleLowerCase()
  document.getElementById(id)?.classList.add('hidden');
  document.getElementById(id)?.classList.remove('show_element');
};




export const printBarCode = (
  elementId: string,
) => {

  let dateF = convertDateFormatedDate(new Date())
  dateF = dateF.replaceAll('-','/')
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`L'élément avec l'ID "${elementId}" n'existe pas.`);
    return;
  }

  const width = 900;
const height = 700;

const left = (window.screen.width - width) / 2;
const top = (window.screen.height - height) / 2;

const printWindow = window.open('', '', `width=${width},height=${height},left=${left},top=${top}`);

  if (!printWindow) {
    console.error("Impossible d'ouvrir la fenêtre d'impression.");
    return;
  }

  // Récupérer tous les styles actifs
  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules || [])
          .map((rule) => rule.cssText)
          .join('\n');
      } catch (e) {
        return ''; // Éviter les erreurs CORS
      }
    })
    .join('\n');
    printWindow.document.write(`
      <html>
        <head>
          <title>Impression</title>
          <style>${styles}</style>
        </head>
        <body>
          <div class="print-container">
            ${element.outerHTML}
          </div>
        </body>
      </html>
    `);

      printWindow.document.close();

      // Délai pour garantir que les styles sont appliqués
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 200);
    };

export const printTableElementById = (
  elementId: string,
  hiddenSelectors: string[],
  title:string="",
  date:Date
) => {

  let dateF = convertDateFormatedDate(new Date())
  dateF = dateF.replaceAll('-','/')
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`L'élément avec l'ID "${elementId}" n'existe pas.`);
    return;
  }

  const width = 900;
const height = 700;

const left = (window.screen.width - width) / 2;
const top = (window.screen.height - height) / 2;

const printWindow = window.open('', '', `width=${width},height=${height},left=${left},top=${top}`);

  if (!printWindow) {
    console.error("Impossible d'ouvrir la fenêtre d'impression.");
    return;
  }

  // Récupérer tous les styles actifs
  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules || [])
          .map((rule) => rule.cssText)
          .join('\n');
      } catch (e) {
        return ''; // Éviter les erreurs CORS
      }
    })
    .join('\n');

  // Styles pour l'impression A4
  const printStyles = `
  @media print {
    body {
      margin: 0;
      padding: 0;
      top:0;
      top: 0;
    right: 0;

      border: none;
    }

    @page {
      /* size: A4;*/
      /*margin: 10mm;  Réduit les marges pour maximiser l'espace */
    }
      @top-left {
      content: none;
    }
    @bottom-left {
      content: none;
    }

    .print-container {
      width: 100%;
      height: auto;
      page-break-before: always;
      overflow: visible; /* Permet de forcer l'affichage même si la taille excède */
    }

    table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      page-break-inside: auto; /* Assure que le contenu reste sur une seule page */
    }

    th, td {
      border: 1px solid black;
      padding: 8px;
      word-wrap: break-word;
    }

    /* Contrôler les coupures entre pages */
    tr {
      page-break-inside: avoid; /* Evite que les lignes de table soient coupées en deux */
    }
       body {
      color:black !important;
    }
  }
`;
  // Générer les styles pour masquer certains éléments
  const hiddenStyles = hiddenSelectors
    .map((selector) => `${selector} { display: none !important; }`)
    .join('\n');

  // Injecter le contenu et les styles
  printWindow.document.write(`
  <html>
    <head>
      <title>Impression</title>
      <style>${styles}</style>
      <style>${printStyles}</style>
      <style>${hiddenStyles}</style>
    </head>
    <body>
      <div class="print-container mt-5 p-11">
      <h1 class="text-3xl flex justify-center font-bold text-gray-900">${title}</h1>
        ${element.outerHTML}

        <h5 class="flex justify-end font-bold text-gray-400  my-3 mx-3">${dateF}</h5>
      </div>
    </body>
  </html>
`);

  printWindow.document.close();

  // Délai pour garantir que les styles sont appliqués
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 200);
};














export const printBorderoDepotElementById = (
  elementId: string,
) => {
  let dateF = convertDateFormatedDate(new Date());
  dateF = dateF.replaceAll('-', '/');

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`L'élément avec l'ID "${elementId}" n'existe pas.`);
    return;
  }

  const width = 900;
  const height = 700;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  const printWindow = window.open('', '', `width=${width},height=${height},left=${left},top=${top}`);
  if (!printWindow) {
    console.error("Impossible d'ouvrir la fenêtre d'impression.");
    return;
  }

  // Récupérer tous les styles actifs
  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules || [])
          .map((rule) => rule.cssText)
          .join('\n');
      } catch (e) {
        return ''; // Éviter les erreurs CORS
      }
    })
    .join('\n');

  // Styles pour impression avec marges top et bottom de 8rem
  const printStyles = `
    @media print {
      body {
        margin: 0;
        padding: 0;
        color: black !important;
      }

      @page {
        size: A4;
        margin-top: 10rem;
        margin-bottom: 10rem;
        margin-left: 10mm;
        margin-right: 10mm;
      }

      .print-container {
        width: 100%;
        height: auto;
        page-break-before: always;
        overflow: visible;
      }
    }
  `;

  // Injecter le contenu et les styles dans la nouvelle fenêtre
  printWindow.document.write(`
    <html>
      <head>
        <title>Impression</title>
        <style>${styles}</style>
        <style>${printStyles}</style>
      </head>
      <body>
        <div class="print-container">
          ${element.outerHTML}
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();

  // Délai pour garantir que les styles sont appliqués avant impression
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 200);
};















export const printBorderoDepotElementByI = (
  elementId: string,

) => {

  let dateF = convertDateFormatedDate(new Date())
  dateF = dateF.replaceAll('-','/')
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`L'élément avec l'ID "${elementId}" n'existe pas.`);
    return;
  }

  const width = 900;
const height = 700;

const left = (window.screen.width - width) / 2;
const top = (window.screen.height - height) / 2;

const printWindow = window.open('', '', `width=${width},height=${height},left=${left},top=${top}`);

  if (!printWindow) {
    console.error("Impossible d'ouvrir la fenêtre d'impression.");
    return;
  }

  // Récupérer tous les styles actifs
  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules || [])
          .map((rule) => rule.cssText)
          .join('\n');
      } catch (e) {
        return ''; // Éviter les erreurs CORS
      }
    })
    .join('\n');

  // Styles pour l'impression A4
  const printStyles = `
  @media print {
    body {
      margin: 0;
      padding: 0;
      top:0;
      top: 0;
    right: 0;

      border: none;
    }

    @page {
      /* size: A4;*/
      /*margin: 10mm;  Réduit les marges pour maximiser l'espace */
    }
      @top-left {
      content: none;
    }
    @bottom-left {
      content: none;
    }

    .print-container {
      width: 100%;
      height: auto;
      page-break-before: always;
      overflow: visible; /* Permet de forcer l'affichage même si la taille excède */
    }




    body {
      color:black !important;
    }
  }
`;
  // Générer les styles pour masquer certains éléments


  // Injecter le contenu et les styles
  printWindow.document.write(`
  <html>
    <head>
      <title>Impression</title>
      <style>${styles}</style>
      <style>${printStyles}</style>

    </head>
    <body>
      <div class="print-container">
        ${element.outerHTML}

      </div>
    </body>
  </html>
`);

  printWindow.document.close();

  // Délai pour garantir que les styles sont appliqués
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 200);
};

export const replaceNullDecimalZero = (obj: any): any => {
  if (obj !== undefined) {
    for (const key in obj) {
      if (typeof obj[key] === 'number' && obj[key] === null) {
        obj[key] = 0;
      }

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        obj[key] = replaceNullDecimalZero(obj[key]);
      }
    }
  }
  return obj;
};

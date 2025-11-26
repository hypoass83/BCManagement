
export const showAddConfirmationDialog = (): Promise<boolean> => {

  const confirmationDialog = document.getElementById('add-confirmation-dialog');

  const confirmButton = document.getElementById('add-confirm-button');
  const cancelButton1 = document.getElementById('add-cancel-button-1');
  const cancelButton2 = document.getElementById('add-cancel-button-2');

  confirmationDialog!.classList.remove('hidden');
  confirmationDialog!.classList.add('open');

  const overlay = document.createElement('div');
  overlay.setAttribute('class', 'transition duration fixed inset-0 z-100 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 hs-overlay-backdrop');
  overlay.setAttribute('data-hs-overlay-backdrop-template', '');

  overlay.setAttribute('style', "z-index: 100;");
  document.body.appendChild(overlay);

  return new Promise<boolean>((resolve) => {
    const resolveTrue = () => {
      closeModal();
      resolve(true);
      cleanup();
    };

    const resolveFalse = () => {
      closeModal();
      resolve(false);
      cleanup();
    };

    confirmButton!.addEventListener('click', resolveTrue);
    cancelButton1!.addEventListener('click', resolveFalse);
    cancelButton2!.addEventListener('click', resolveFalse);

    function cleanup() {
      confirmButton!.removeEventListener('click', resolveTrue);
      cancelButton1!.removeEventListener('click', resolveFalse);
      cancelButton2!.removeEventListener('click', resolveFalse);
    }
  });
}


const closeModal = () => {
  const modal = document.getElementById('add-confirmation-dialog');

  if (modal) {
    modal.classList.toggle('hidden');
    const backdrop = document.querySelectorAll('[data-hs-overlay-backdrop-template]');

    // Iterate through the NodeList and remove each element from the DOM
    backdrop.forEach(element => {
      element.parentNode?.removeChild(element);
    });
  }
}


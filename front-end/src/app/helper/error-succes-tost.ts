export const setGlobalErrorMessage = (error: string): void => {
  document.getElementById("generalError")?.classList.remove("display-none");

  const errorpane = document.getElementById("error-message");

  if (errorpane) {
    errorpane.innerHTML = error;
  }

  setTimeout(() => {
    document.getElementById("generalError")?.classList.add("display-none");
  }, 10000)
}

export const removeGlobalErrorMessage = (): void => {
  document.getElementById("generalError")?.classList.add("display-none");
}

export const setGlobalSuccesMessage = (): void => {
  document.getElementById("generalSuccess")?.classList.remove("display-none");
  setTimeout(() => {
    document.getElementById("generalSuccess")?.classList.add("display-none");
  }, 3000)
}

export const removeGlobalSuccesMessage = (): void => {
  document.getElementById("generalSuccess")?.classList.add("display-none");
}


export const addLoadingClass = () => {

  document.body.classList.add('loading');
}

export const removeLoadingClass = () => {
  document.body.classList.remove('loading');
}


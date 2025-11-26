
export function handleThemeUpdate(cssVars: any) {
  const root: any = document.querySelector(':root');
  const keys = Object.keys(cssVars);

  keys.forEach((key) => {
    root.style.setProperty(key, cssVars[key]);
  });
}
// to check the value is hexa or not
const isValidHex = (hexValue: any) =>
  /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hexValue);

const getChunksFromString = (st: any, chunkSize: any) =>
  st.match(new RegExp(`.{${chunkSize}}`, 'g'));
// convert hex value to 256
const convertHexUnitTo256 = (hexStr: any) =>
  parseInt(hexStr.repeat(2 / hexStr.length), 16);
// get alpha value is equla to 1 if there was no value is asigned to alpha in function
const getAlphafloat = (a: any, alpha: any) => {
  if (typeof a !== 'undefined') {
    return a / 255;
  }
  if (typeof alpha != 'number' || alpha < 0 || alpha > 1) {
    return 1;
  }
  return alpha;
};
// convertion of hex code to rgba code
export function hexToRgba(hexValue: any, alpha = 1) {
  if (!isValidHex(hexValue)) {
    return null;
  }
  const chunkSize = Math.floor((hexValue.length - 1) / 3);
  const hexArr = getChunksFromString(hexValue.slice(1), chunkSize);
  const [r, g, b, a] = hexArr.map(convertHexUnitTo256);
  return `${r}, ${g}, ${b}, ${getAlphafloat(a, alpha)}`;
}
export function hexToRgba2(hexValue: any, alpha = 1) {
  if (!isValidHex(hexValue)) {
    return null;
  }
  const chunkSize = Math.floor((hexValue.length - 1) / 3);
  const hexArr = getChunksFromString(hexValue.slice(1), chunkSize);
  const [r, g, b, a] = hexArr.map(convertHexUnitTo256);
  return `${r - 14}, ${g - 14}, ${b - 14}, ${getAlphafloat(a, alpha)}`;
}
//primary theme color
export function dynamicLightPrimaryColor(primaryColor: any, color: any) {
  primaryColor.forEach((item: any) => {
    const cssPropName = `--color-${item.getAttribute('data-id')}`;
    const cssPropName1 = `--color-${item.getAttribute('data-id1')}`;

    handleThemeUpdate({
      [cssPropName]: hexToRgba(color),
      [cssPropName1]: hexToRgba(color),
    });
  });
}

//background theme color
export function dynamicBgTrasnsparentPrimaryColor(
  primaryColor: any,
  color: any
) {
  primaryColor.forEach((item: any) => {
    const cssPropName1 = `--body-${item.getAttribute('data-id5')}`;
    const cssPropName2 = `--dark-${item.getAttribute('data-id6')}`;
    handleThemeUpdate({
      [cssPropName1]: hexToRgba(color),
      [cssPropName2]: hexToRgba2(color),
    });
  });
}

export function localStorageBackUp() {
  let html = document.querySelector('html');
  if (localStorage.getItem('data-header-styles') == 'dark') {
    if (html?.setAttribute('class', 'dark')) {
      const light = document.getElementById(
        'switcher-light'
      ) as HTMLInputElement;
      light.checked = true;
    } else {
      if (html?.setAttribute('class', 'light')) {
        const light = document.getElementById(
          'switcher-light'
        ) as HTMLInputElement;
        light.checked = true;
      }
    }
  }

  if (localStorage.getItem('synto-dir') == 'rtl') {
    html?.setAttribute("dir", 'rtl');
  }
  if (localStorage.getItem('synto-theme-mode')) {
    const type: any = localStorage.getItem('synto-theme-mode');
    html?.setAttribute('class', type);
  }
  if (localStorage.getItem('synto-nav-mode')) {
    const type: any = localStorage.getItem('synto-nav-mode');
    html?.setAttribute('data-nav-layout', type);
    if (type == 'horizontal') {
      html?.setAttribute('data-menu-styles', 'light');
    }
  }
  if (localStorage.getItem('synto-page-mode')) {
    const type: any = localStorage.getItem('synto-page-mode');
    html?.setAttribute('data-page-style', type);
  }
  if (localStorage.getItem('synto-width-mode')) {
    const type: any = localStorage.getItem('synto-width-mode');
    html?.setAttribute('data-width', type);
  }
  if (localStorage.getItem('synto-menu-position')) {
    const type: any = localStorage.getItem('synto-menu-position');
    html?.setAttribute('data-menu-position', type);
  }
  if (localStorage.getItem('synto-menu-mode')) {
    const type: any = localStorage.getItem('synto-menu-mode');
    html?.setAttribute('data-menu-styles', type);
  }
  if (localStorage.getItem('synto-header-position')) {
    const type: any = localStorage.getItem('synto-header-position');
    html?.setAttribute('data-header-position', type);
  }
  if (localStorage.getItem('synto-header-mode')) {
    const type: any = localStorage.getItem('synto-header-mode');
    html?.setAttribute('data-header-styles', type);
  }

  if (localStorage.getItem("synto-background-mode-body")) {
    const bodytype: any = localStorage.getItem("synto-background-mode-body")
    const darktype: any = localStorage.getItem("synto-background-mode-dark")
    const event: any = localStorage.getItem("synto-theme-mode");
    html?.style.setProperty('--body-bg', bodytype);
    html?.style.setProperty('--dark-bg', darktype);
    html?.setAttribute("class", event);
  }
  if (localStorage.getItem("Syntolight-background-body")) {
    const bodytype: any = localStorage.getItem("Syntolight-background-body")
    const darktype: any = localStorage.getItem("Syntolight-background-dark")
    html?.style.setProperty('--body-bg', bodytype);
    html?.style.setProperty('--dark-bg', darktype);
    html?.classList.add('dark');
  }
  if (localStorage.getItem("synto-menu-styles")) {
    const type1: any = localStorage.getItem("synto-menu-styles");
    html?.setAttribute("data-nav-style", type1);
    const type: any = localStorage.getItem('synto-menu-styles-toggled');
    html?.setAttribute('toggled', type);
  }
  if (localStorage.getItem("synto-image")) {
    const type: any = localStorage.getItem("synto-image");
    html?.setAttribute('bg-img', type);
  }
  if (localStorage.getItem("synto-primary-mode")) {
    const type: any = localStorage.getItem("synto-primary-mode");
    html?.style.setProperty('--color-primary-rgb', type);
    html?.style.setProperty('--color-primary', type);
  }
  if (localStorage.getItem("Syntolight-primary-color")) {
    const type: any = localStorage.getItem("Syntolight-primary-color");
    html?.style.setProperty('--color-primary-rgb', type);
    html?.style.setProperty('--color-primary', type);
  }

  const savedTheme = localStorage.getItem('synto-theme-mode') || 'light';

  // Change AG Grid Theme
  const gridContainers = document.querySelectorAll('.ag-grid-container ag-grid-angular');
  gridContainers.forEach(grid => {
    grid.classList.remove('ag-theme-alpine', 'ag-theme-alpine-dark');
    grid.classList.add(savedTheme === 'dark' ? 'ag-theme-alpine-dark' : 'ag-theme-alpine');
  });




}

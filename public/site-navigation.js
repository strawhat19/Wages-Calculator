export function bindHeaderMenus(root = document) {
  const ownerDocument = root.ownerDocument || root;
  const openMenus = () => root.querySelectorAll(`details.header-menu[open]`);

  const onClick = (event) => {
    for (const menu of openMenus()) {
      if (!menu.contains(event.target) || event.target.closest?.(`a[href]`)) {
        menu.open = false;
      }
    }
  };

  const onKeyDown = (event) => {
    if (event.key !== `Escape`) return;

    for (const menu of openMenus()) {
      menu.open = false;
      menu.querySelector(`summary`)?.focus();
      event.preventDefault();
    }
  };

  ownerDocument.addEventListener(`click`, onClick);
  ownerDocument.addEventListener(`keydown`, onKeyDown);

  return () => {
    ownerDocument.removeEventListener(`click`, onClick);
    ownerDocument.removeEventListener(`keydown`, onKeyDown);
  };
}

if (typeof document !== `undefined` && document.body?.classList.contains(`document-page--article`)) {
  bindHeaderMenus();
}

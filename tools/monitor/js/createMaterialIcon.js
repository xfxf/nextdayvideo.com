
export const createMaterialIcon = (text) => {
  const base = document.createElement('span');
  base.classList.add('material-icons');

  base.appendChild(document.createTextNode(text));

  return base;
};

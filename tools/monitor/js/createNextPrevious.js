import { createMaterialIcon } from './createMaterialIcon.js?v=15';

export const createNextPrevious = (within, className, title, icon, eventHandler) => {
  const base = document.createElement('button');
  base.classList.add(className);
  base.setAttribute('title', title);

  base.appendChild(createMaterialIcon(icon));

  base.addEventListener('click', (ev) => {    
    eventHandler();

    ev.preventDefault();
    return false;
  });

  within.append(base);

  return base;
};

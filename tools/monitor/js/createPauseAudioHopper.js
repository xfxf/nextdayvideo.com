import { createMaterialIcon } from './createMaterialIcon.js?v=15';

export const createPauseAudioHopper = (within, paused, pauseHopper) => {
  const base = document.createElement('button');

  base.classList.add('pause-audio-hopper');

  base.setAttribute('title', 'Pause/resume the rotation');

  const repeat = createMaterialIcon('update');
  const repeatOne = createMaterialIcon('update_disabled');

  const updateButton = (isPasued) => {
    if (isPasued) {
      if (repeat.parentNode) {
        repeat.parentNode.removeChild(repeat);
      }
      base.appendChild(repeatOne);
      base.setAttribute('title', 'Automatic audio switching paused');
    } else {
      if (repeatOne.parentNode) {
        repeatOne.parentNode.removeChild(repeatOne);
      }
      base.appendChild(repeat);
      base.setAttribute('title', 'Automatic audio switching enabled');
    }
  };

  updateButton(paused);

  base.addEventListener('click', (ev) => {
    console.log('[all] pause audio click... ');

    pauseHopper(updateButton);

    ev.preventDefault();
    return false;
  });

  within.append(base);

  return updateButton;
};

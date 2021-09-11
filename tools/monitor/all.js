import { fetchRooms, viewerURI } from './fetchRooms.js?v=14';
import { wait } from './wait.js?v=14';

export const createStreamIframe = (within) => (id, destination, style) => {
  const base = document.createElement('iframe');

  base.setAttribute('src', destination);
  base.setAttribute('style', style);
  base.setAttribute('x-id', id);

  within.append(base);

  return base;
};

const createMaterialIcon = (text) => {
  const base = document.createElement('span');
  base.classList.add('material-icons');

  base.appendChild(document.createTextNode(text));

  return base;
}

const createPauseAudioHopper = (within, pauseHopper) => {
  const base = document.createElement('button');

  base.classList.add('pause-audio-hopper');

  base.setAttribute('title', 'Pause/resume the rotation');

  const repeat = createMaterialIcon('repeat');
  const repeatOne = createMaterialIcon('repeat_one');

  base.appendChild(repeat);

  base.addEventListener('click', (ev) => {
    console.log('[all] pause audio click... ');

    if (pauseHopper()) {
      base.removeChild(repeat);
      base.appendChild(repeatOne);
    } else {
      base.removeChild(repeatOne);
      base.appendChild(repeat);

    }

    ev.preventDefault();
    return false;
  })

  within.append(base);

  return base;
}

const createStartAudioHopper = (within, rotateAudio) => {
  const base = document.createElement('button');

  base.classList.add('start-audio-hopper');

  base.setAttribute('title', 'Volume Off - Click to enable audio hopper');

  base.appendChild(createMaterialIcon('volume_off'));

  base.addEventListener('click', (ev) => {
    console.log('[all] rotate audio click... ');
    rotateAudio();

    ev.preventDefault();

    base.parentNode.removeChild(base);

    return false;
  })

  within.append(base);

  return base;
};

const rotateAudio = (streamFrames, speed) => async () => {

  console.log('[all] beging rotating audio...');

  let paused = false;

  createPauseAudioHopper(document.body, () => {
    paused = !paused;

    return paused;
  });

  let count = streamFrames.length;
  let current = 0;

  while (current < count) {
    if (!paused) {
      for (let o = 0; o < count; ++o) {
        try {
          streamFrames[o].contentDocument.getElementsByTagName('video')[0].muted = o !== current;
          streamFrames[o].contentDocument.body.style.backgroundColor = o === current ? 'red' : '';
        } catch (err) {
          console.log(`[all] Could not mute/unmute ${o}: ${err.message}`);
        }
      }

      if (current === count - 1) {
        current = 0;
      } else {
        current++;
      }
    }

    await wait(speed);
  }

}

const roomLayouts = {
  2: [
    'width: calc(50% - 1px); height: calc(100% - 50px); position: absolute; left: 0; top: 0px;',
    'width: calc(50% - 1px); height: calc(100% - 50px); position: absolute; right: 0; top: 0px;',
  ],
  3: [
    'width: calc(50% - 1px); height: calc(50% - 1px); position: absolute; left: 0; top: 0;',
    'width: calc(50% - 1px); height: calc(50% - 1px); position: absolute; right: 0; top: 0;',
    'width: calc(50% - 1px); height: calc(50% - 1px); position: absolute; left: 25%; bottom: 0;',
  ],
  4: [
    'width: calc(50% - 1px); height: calc(50% - 1px); position: absolute; left: 0; top: 0;',
    'width: calc(50% - 1px); height: calc(50% - 1px); position: absolute; right: 0; top: 0;',
    'width: calc(50% - 1px); height: calc(50% - 1px); position: absolute; left: 0; bottom: 0;',
    'width: calc(50% - 1px); height: calc(50% - 1px); position: absolute; right: 0; bottom: 0;',
  ]
};

const run = async () => {
  console.log('hi');

  const streamIframe = createStreamIframe(document.body);

  const { ok, rooms } = await fetchRooms();

  if (!ok) {
    alert('Could not get rooms. Try again.');
  }

  let roomIndex = 0;
  let layouts = roomLayouts[rooms.length];

  const streamFrames = [];
  for (const { id } of rooms) {
    streamFrames.push(streamIframe(id, viewerURI(id), layouts[roomIndex++]));
  }

  let params = new URLSearchParams(location.search.slice(1));

  let rotateSpeed = 5;

  if (params.has('audio-hopper')) {
    rotateSpeed = parseInt(params.get('audio-hopper'), 10);

    if (isNaN(rotateSpeed)) {
      throw new Error('audio-hopper is not a number, this is... not supported');
    }
  }

  createStartAudioHopper(document.body, rotateAudio(streamFrames, rotateSpeed * 1000));
};

run().catch(err => console.error('Failed somewhere', err));

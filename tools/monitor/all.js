import { createStreamIframe } from './js/createStreamIframe.js?v=16';
import { fetchRooms, viewerURI } from './fetchRooms.js?v=16';
import { roomLayouts } from './js/roomLayouts.js?v=16';
import { wait } from './wait.js?v=16';
import { createPauseAudioHopper } from './js/createPauseAudioHopper.js?v=16';
import { createStartAudioHopper } from './js/createStartAudioHopper.js?v=16';
import { createNextPrevious } from './js/createNextPrevious.js?v=16';

const createFocusAudio = (muteFunctions) => {
  const count = muteFunctions.length;
  
  return (focussed) => {
    for (let index = 0; index < count; ++index) {
      muteFunctions[index](index === focussed);
    }
  };
};

const createAudioController = (streamFrames, speed) => async () => {
  const muteFunctions = streamFrames.map((frame) => {
    frame.contentDocument.getElementsByTagName('video')[0].muted = false;

    const setGain = frame.contentWindow.setupAudioMeterForMultiview();

    return (mute) => {
      setGain(mute ? 0 : 1);
    };
  });

  const focusAudio = createFocusAudio(muteFunctions);

  console.log('[all] beging rotating audio...');

  let paused = true;
  let nextChange = Date.now();
  let count = muteFunctions.length;
  let current = 0;

  const move = (by) => {
    if (current + by < 0) {
      current = count - 1;
    } else if (current + by >= count) {
      current = 0;
    } else {
      current = current + by;
    }

    focusAudio(current);
  };

  createNextPrevious(document.body, 'prev-audio-hopper', 'Previous', 'navigate_before', () => {
    move(-1);
  });

  createNextPrevious(document.body, 'next-audio-hopper', 'Next', 'navigate_next', () => {
    move(1);
  });

  createPauseAudioHopper(document.body, paused, (updateButton) => {
    paused = !paused;
    
    nextChange = Date.now();

    updateButton(paused);
  });

  focusAudio(current);

  do {
    if (Date.now() < nextChange) {
      // Do nothing      
    } else if (!paused) {
      move(1);

      nextChange = Date.now() + speed;
    }

    await wait(1000/60);

  } while(true);
}

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

  let rotateSpeed = 30;

  if (params.has('audio-hopper')) {
    rotateSpeed = parseInt(params.get('audio-hopper'), 10);

    if (isNaN(rotateSpeed)) {
      throw new Error('audio-hopper is not a number, this is... not supported');
    }
  }

  createStartAudioHopper(document.body, createAudioController(streamFrames, rotateSpeed * 1000));
};

run().catch(err => console.error('Failed somewhere', err));

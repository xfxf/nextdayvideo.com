import { fetchRooms, viewerURI } from './fetchRooms.js?v=13';

export const createStreamIframe = (within) => (id, destination, style) => {
  const base = document.createElement('iframe');

  base.setAttribute('src', destination);
  base.setAttribute('style', style);
  base.setAttribute('x-id', id);

  within.append(base);
};

const roomLayouts = {
  2: [
    'width: calc(50% - 1px); height: calc(50% - 1px); position: absolute; left: 0; top: 25%;',
    'width: calc(50% - 1px); height: calc(50% - 1px); position: absolute; right: 0; top: 25%;',
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
  for (const { id, name } of rooms) {
    streamIframe(id, viewerURI(id), layouts[roomIndex++]);
  }
};

run().catch(err => console.error('Failed somewhere', err));
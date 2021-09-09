import { castURI, fetchRooms, viewerURI } from './fetchRooms.js?v=12';

export const createRoomLink = (within) => (destination, label) => {
  const base = document.createElement('li');
  const link = document.createElement('a');

  link.setAttribute('href', destination);

  const text = document.createTextNode(label);
  link.appendChild(text);

  base.appendChild(link);

  within.append(base);
};


const run = async () => {
  console.log('hi');

  const roomList = document.getElementById('room-list');
  const roomLink = createRoomLink(roomList);

  const { ok, rooms } = await fetchRooms();

  if (!ok) {
    alert('Could not get rooms. Try again.');
  }

  for (const { id, name } of rooms) {
    roomLink(viewerURI(id), name);
  }

  for (const { id, name } of rooms) {
    roomLink(castURI(id), `Cast: ${name}`);
  }
};

run().catch(err => console.error('Failed somewhere', err));
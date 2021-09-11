import { castURI, fetchRooms, viewerURI } from './fetchRooms.js?v=17';

const createLink = (href, label) => {
  const link = document.createElement('a');
  link.setAttribute('href', href);
  link.innerText = label;
  return link;
}

export const createRoomLink = (within) => (id, label) => {
  const base = document.createElement('li');
  base.appendChild(createLink(viewerURI(id), label));
  base.appendChild(document.createTextNode(' ['));
  base.appendChild(createLink(castURI(id), 'Cast'));
  base.appendChild(document.createTextNode(']'));
  within.append(base);
};


const run = async () => {
  const roomList = document.getElementById('room-list');
  const roomLink = createRoomLink(roomList);

  const { ok, rooms } = await fetchRooms();

  if (!ok) {
    alert('Could not get rooms. Try again.');
  }

  for (const { id, name } of rooms) {
    roomLink(id, name);
  }
};

run().catch(err => console.error('Failed somewhere', err));
import { nanoid } from 'https://unpkg.com/nanoid@3.1.25/non-secure/index.js?module';

export const fetchRooms = async () => {
  try {
    const before = Date.now();
    const fetchResponse = await fetch(`rooms.json?${nanoid()}`);
    const rooms = await fetchResponse.json();

    const totalTime = Date.now() - before;

    console.log(`[Rooms] Got rooms in ${totalTime}ms`, rooms);

    return { ok: true, rooms };
  } catch(err) {
    return { ok: false, error: err.message }
  }
}

export const viewerURI = (id) => `dynamic.html?id=${encodeURIComponent(id)}&v=${nanoid()}`;
export const castURI = (id) => `cast.html?id=${encodeURIComponent(id)}&v=${nanoid()}`;

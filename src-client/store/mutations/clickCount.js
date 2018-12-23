import { updateStore, store } from 'fluxible-js';

export function increment () {
  console.log(store.clickCount);

  updateStore({
    clickCount: store.clickCount + 1
  });
}

export function decrement () {
  updateStore({
    clickCount: store.clickCount - 1
  });
}

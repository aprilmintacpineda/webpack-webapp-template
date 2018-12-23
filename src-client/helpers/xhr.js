import FetchWorkerThread from '_workers/fetch';

export default (url, options) => new Promise((resolve, reject) => {
  const FetchWorker = new FetchWorkerThread();

  FetchWorker.onmessage = ev => {
    if ('response' in ev.data) {
      resolve(ev.data.response);
    } else {
      reject(ev.data.error);
    }
  };

  FetchWorker.postMessage({
    url,
    options
  });
});

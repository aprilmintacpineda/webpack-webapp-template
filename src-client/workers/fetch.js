self.onmessage = payload => {
  let options = {};

  if (payload.options) {
    options = {
      ...payload.options
    };
  }

  if ('method' in options === false) {
    options.method = 'get';
  }

  options.credentials = 'include';

  fetch(payload.data.url, options)
    .then(response => response.json())
    .then(response => {
      self.postMessage({
        response
      });

      self.close();
    })
    .catch(err => {
      self.postMessage({
        error: err.message
      });

      self.close();
    });
};

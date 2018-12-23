let passiveSupported = false;

try {
  const options = {
    get passive () {
      passiveSupported = true;
      return true;
    }
  };

  window.addEventListener('test', options, options);
  window.removeEventListener('test', options, options);
} catch (err) {
  // eslint-disable-next-line
  console.error(`pasive listener supported failed > ${err.message}`);
}

export function addPassiveListener (target, event, handler) {
  if (passiveSupported) {
    target.addEventListener(event, handler, {
      passive: true
    });
  } else {
    target.addEventListener(event, handler);
  }
}

export function errorList (errors) {
  return errors.map(err =>
    <p key={err}>{err}</p>
  );
}

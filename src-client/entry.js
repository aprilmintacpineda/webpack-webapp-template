import './registerServiceWorker';

// global styles
import 'normalize.css/normalize.css';
import '_styles/globals.scss';

import { render } from 'inferno';
import { HashRouter, Route, NavLink } from 'inferno-router';
import { initializeStore } from 'fluxible-js';
import localforage from 'localforage';
import asyncComponent from 'inferno-async-component';

import initialStore from '_store/initialStore';

const Home = asyncComponent(
  () => import('_routes/Home' /* webpackChunkName: 'Home' */)
);

const ClickCounter = asyncComponent(
  () => import('_routes/ClickCounter' /* webpackChunkName: 'ClickCounter' */)
);

localforage.config({
  driver: [
    localforage.WEBSQL,
    localforage.INDEXEDDB,
    localforage.LOCALSTORAGE
  ],
  name: 'webapp_template',
  version: '1.0.0',
  storeName: 'webapp_template', // Should be alphanumeric, with underscores.
  description: 'Cache storage used to improve user experience.'
});

initializeStore({
  initialStore,
  persist: {
    asyncStorage: localforage,
    restore: savedStore => ({
      clickCount: savedStore.clickCount
    })
  }
});

render(
  <>
    <HashRouter>
      <NavLink to="/" exact={true}>Home</NavLink> |{' '}
      <NavLink to="/click-counter">Click Counter</NavLink>
      <Route exact={true} path="/" component={Home} />
      <Route path="/click-counter" component={ClickCounter} />
    </HashRouter>
  </>
  , document.getElementById('app')
);

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

declare global {
  interface Window {
    loadSharedUi: (data: Data, mount: HTMLElement | null) => void;
  }
}

export type Data = {
  routeToLoad?: string;
  token: string;
};

if (process.env.NODE_ENV === 'development') {
  let passedInData = {
    token: 'my-bad-token',
  };

  ReactDOM.render(<App data={passedInData} />, document.getElementById('root'));
} else {
  window.loadSharedUi = (
    data: Data,
    mount: HTMLElement | null = document.getElementById('root')
  ) => {
    ReactDOM.render(<App data={data} />, mount);
  };
}

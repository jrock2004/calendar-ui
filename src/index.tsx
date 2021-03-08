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

let passedInData = {
  token: 'my-bad-token',
};

ReactDOM.render(<App data={passedInData} />, document.getElementById('root'));

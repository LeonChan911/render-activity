import App from './App.jsx';
import ReactDOM from 'react-dom';
import * as ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { initializeRepo } from './repo';

initializeRepo();

export function renderAppToHtml(config, htmlTemplate) {
  const { app, styleTags } = renderAppToString(config);

  const lastHtml = htmlTemplate
    .replace('<div id="root"></div>', `<div id="root">${app}</div>`)
    .replace('__SERVER_DATA__', JSON.stringify(config))
    .replace('__STYLE_TAGS__', styleTags);

  return lastHtml;
}

function renderAppToString(config) {
  let app = '';
  let styleTags = '';

  const sheet = new ServerStyleSheet();

  app = ReactDOMServer.renderToString(
    sheet.collectStyles(<App config={config} />)
  );
  styleTags = sheet.getStyleTags();

  return { app, styleTags };
}

if (typeof document !== 'undefined') {
  const rootElement = document.getElementById('root');
  ReactDOM.hydrate(<App config={window.serverData} />, rootElement);
}

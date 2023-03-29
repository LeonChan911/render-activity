const express = require('express');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { extractElements, writeModulesFile } = require('./generator');
const { paths } = require('./paths');
const webpackConfig = require('../webpack.config');

const app = express();
const port = 4444;

app.use(express.static(__dirname + '/../dist'));

/**
 * 以 dist/shell.js 为入口，生成 dist/bundle.js 文件
 */
function bundle() {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(stats);
    });
  });
}

app.get('/', async (req, res) => {
  const elements = await extractElements();
  writeModulesFile(elements);
  // 在得到 modules 文件后，就可以进行打包操作
  await bundle();

  const htmlTemplate = fs.readFileSync(
    paths.appPublic + '/index.html',
    'utf-8'
  );
  const { renderAppToHtml } = require(paths.appDist + '/shell');
  const lastHtml = renderAppToHtml(elements, htmlTemplate);

  fs.writeFileSync(path.resolve(__dirname, '../dist/index.html'), lastHtml);
  res.send(lastHtml);
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

const path = require('path');
const fs = require('fs-extra');

const appDirectory = fs.realpathSync(path.join(__dirname, '../'));
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

const paths = {
  appPath: resolveApp('.'),
  /** 打包后的代码 */
  appDist: resolveApp('dist'),
  /** dist/module.js 文件的生成 */
  appModuleJS: resolveModule(resolveApp, 'dist/module'),
  appPublic: resolveApp('public'),
};

module.exports = { paths, resolveApp };

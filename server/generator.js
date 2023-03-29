const fs = require('fs');
const { installPackage } = require('./install');
const { paths, resolveApp } = require('./paths');

async function extractElements() {
  try {
    const jsonFileContent = fs.readFileSync(__dirname + '/activity.json');
    const config = JSON.parse(JSON.parse(jsonFileContent).config);

    const staticElements = config.staticElements;
    // 此时仅处理 static 类型的组件
    const elements = staticElements;

    for (const element of elements) {
      // 安装前会先检查是否已经安装
      await installPackage(element.name, element.version, resolveApp('dist'));
    }

    return elements;
  } catch (err) {
    console.log('err: ', err);
  }
}

// 生成 modules.js 文件
function writeModulesFile(elements) {
  const content = generateModulesContent(
    elements.map((element) => {
      return `${element.name}@${element.version}`;
    })
  );
  fs.writeFileSync(paths.appModuleJS, content);
}

/**
 * 获取包的别名
 * @param pkg 带版本号的包名 @xmc/image-container@0.0.1
 * @returns @xmc/image-container-0.0.1
 */
function getPackageAlias(pkg) {
  return pkg.replace(/(.*)@/, '$1-'); // 正则的贪婪模式，替换最后一个 @
}

/**
 * 获取组件的唯一引用名
 * @param packageName @xmc/image-container@0.0.1
 * @returns ImageContainer_0_0_1
 */
function getReactComponentName(packageName) {
  const pieces = packageName.split('@');
  const version = pieces.pop();
  // image-container
  const name = pieces.join('@').replace('@xmc/', '');
  // ImageContainer
  const componentName = name
    .split('-')
    .map((n) => `${n.charAt(0).toUpperCase()}${n.substring(1)}`)
    .join('');
  return `${componentName}_${version.replace(/\./g, '_')}`;
}

/**
 * 生成组件列表的内容
 * @param packages 依赖列表
 * @returns 文件内容
 */
function generateModulesContent(packages) {
  const importBlock = packages.reduce((prev, pkg) => {
    return `${prev}const ${getReactComponentName(
      pkg
    )} = require('${getPackageAlias(pkg)}').default;\n`;
  }, '');
  const listBlock = packages.reduce((prev, pkg) => {
    return `${prev}\n  '${pkg}': ${getReactComponentName(pkg)},`;
  }, '');
  // 勿调整缩进，保持生成文件格式
  const content = `${importBlock}
const modules = {${listBlock}
};
  
module.exports = modules;\n`;

  return content;
}

module.exports = {
  extractElements,
  writeModulesFile,
};

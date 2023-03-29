const fs = require('fs');
const { spawn } = require('child_process');
const chalk = require('chalk');
const { paths } = require('./paths');

function checkXmcExist(name, root = 'node_modules') {
  let exist = false;
  try {
    exist = fs.existsSync(`${root}/@xmc/${name}`);
  } catch (e) {
    console.log(e);
  }
  return exist;
}

async function installPackage(pkg, version, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    if (
      checkXmcExist(
        `${pkg.replace(/^@xmc\//, '')}-${version}`,
        paths.appDist + '/node_modules'
      )
    ) {
      console.log(`${chalk.greenBright(`${pkg}已安装`)}`);
      resolve('success');
      return;
    }

    const args = [
      'add',
      `${pkg}-${version}@npm:${pkg}@${version}`,
      '--cwd',
      './',
      `--registry=http://xnpm.ximalaya.com`,
    ];

    // const cwd = process.cwd();
    const proc = spawn('yarn', args, {
      stdio: 'inherit',
      cwd,
    });

    proc.on('error', (err) => {
      console.log(chalk.red(err));
      reject(new Error(`yarn add ${pkg}@${version} err`));
    });

    console.log(
      `${chalk.blueBright('[dependencies#开始安装]:')}\n yarn ${args.join(' ')}`
    );

    proc.on('exit', (code) => {
      resolve('success');
    })
  });
}

module.exports = { installPackage };

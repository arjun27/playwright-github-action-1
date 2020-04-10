const core = require('@actions/core');
const { exec } = require('@actions/exec');
const os = require('os');

function isRunningAsRoot() {
  return new Promise(async (resolve, reject) => {
    await exec('id', ['-u'], {
      listeners: {
        stdout: (data) => {
          const result = Number(data.toString());
          console.log('------resutl', result);
          resolve(result === 0);
        }
      }
    })
  })
}

const chromiumDependencies = ['libgbm-dev']
const webkitDependencies = ['libwoff1', 'libopus0', 'libwebp6', 'libwebpdemux2',
                            'libenchant1c2a', 'libgudev-1.0-0', 'libsecret-1-0',
                            'libhyphen0', 'libgdk-pixbuf2.0-0', 'libegl1',
                            'libgles2', 'libevent-2.1-6', 'libnotify4', 'libxslt1.1']
const firefoxDependencies = ['ffmpeg']

const busterDependencies = [
  'gconf-service', 'libasound2', 'libatk1.0-0', 'libatk-bridge2.0-0', 'libc6',
  'libcairo2', 'libcups2', 'libdbus-1-3', 'libexpat1', 'libfontconfig1', 'libgcc1', 'libgconf-2-4',
  'libgdk-pixbuf2.0-0', 'libglib2.0-0', 'libgtk-3-0', 'libnspr4', 'libpango-1.0-0', 'libpangocairo-1.0-0',
  'libstdc++6', 'libx11-6', 'libx11-xcb1', 'libxcb1', 'libxcomposite1', 'libxcursor1', 'libxdamage1', 'libxext6',
  'libxfixes3', 'libxi6', 'libxrandr2', 'libxrender1', 'libxss1', 'libxtst6', 'ca-certificates', 'fonts-liberation',
  'libappindicator1', 'libnss3', 'lsb-release', 'xdg-utils', 'wget',
  'libgbm1',
  'libseccomp2', 'libxslt1.1', 'woff2', 'libevent-dev', 'libopus0',
  'libwebpdemux2', 'libegl1', 'libgles2', 'libgudev-1.0-0', 'libvpx5'
]

async function run() {
  try {
    if (os.platform() === 'linux') {
      // await exec('command', ['-v', 'sudo'], {
      //   listeners: {
      //     stdout: (data) => {
      //       console.log(data.toString());
      //     }
      //   }
      // })
      const isSudo = await isRunningAsRoot();
      console.log('+++ result', isSudo);

      if (isSudo) {
        await exec('apt-get', ['update']);
        await exec('apt-get', ['install', '-y', ...chromiumDependencies]);
        await exec('apt-get', ['install', '-y', ...webkitDependencies]);
        await exec('apt-get', ['install', '-y', ...firefoxDependencies]);
        await exec('apt-get', ['install', '-y', ...busterDependencies]);
      }

      // await exec('sudo', ['apt-get', 'update']);
      // await exec('apt-get', ['update']);
      // // For Chromium
      // await exec('sudo', ['apt-get', 'install', 'libgbm-dev']);
      // // For WebKit
      // await exec('sudo', ['apt-get', 'install', 'libwoff1',
      //                                           'libopus0',
      //                                           'libwebp6',
      //                                           'libwebpdemux2',
      //                                           'libenchant1c2a',
      //                                           'libgudev-1.0-0',
      //                                           'libsecret-1-0',
      //                                           'libhyphen0',
      //                                           'libgdk-pixbuf2.0-0',
      //                                           'libegl1',
      //                                           'libgles2',
      //                                           'libevent-2.1-6',
      //                                           'libnotify4',
      //                                           'libxslt1.1']);
      // // For video playback in Firefox
      // await exec('sudo', ['apt-get', 'install', 'ffmpeg']);
    }
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()

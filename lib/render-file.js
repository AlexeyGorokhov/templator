'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const transformator = require('./transformator');

/**
 * Renders a particular root template file
 *
 * @param {String} srcFilePath - Absolute path to the root template file
 * @param {String} destFilePath - Absolute path the output destination file
 * @param {Object} data - Object containing data needed to replace placeholders
 *        in templates
 * @return {Promise<Void>}
 */
module.exports = function (srcFilePath, destFilePath, data) {
  return new Promise((resolve, reject) => {
    if (fs.statSync(srcFilePath).isDirectory()) {
      resolve();
      return;
    }

    mkdirp.sync(path.dirname(destFilePath));

    const src = fs.createReadStream(srcFilePath, { encoding: 'utf8' });

    const tr = transformator(data, srcFilePath);
    tr.on('error', (err) => reject(err));

    const dest = fs.createWriteStream(destFilePath);
    dest.on('finish', () => resolve());

    src.pipe(tr).pipe(dest);
  });
};

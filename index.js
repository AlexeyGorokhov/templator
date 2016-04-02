'use strict';

const path = require('path');
const globby = require('globby');
const del = require('del');
const renderFile = require('./lib/render-file');

/**
 * @member Renders all files from the source folder
 *
 * @param {String} srcFolder - Absolute path to the folder with templates
 * @param {String} destFolder - Absolute path to the destination folder
 * @param {Object} data - Object containing data needed to replace placeholders
 *        in templates
 * @param {Promise}
 */
module.exports = function (srcFolder, destFolder, data) {
  return new Promise((resolve, reject) => {
    const srcGlob = [path.join(srcFolder, '**/*'), '!**/_*.*'];
    const srcPaths = globby.sync(srcGlob);
    const destGlob = path.join(destFolder, '**');

    del.sync([destGlob]);

    const jobs = Array.prototype.map.call(srcPaths, p => {
      const destFilePath =
        path.join(destFolder, path.relative(srcFolder, p));
      return renderFile(p, destFilePath, data);
    });

    Promise.all(jobs)
      .then(
        () => resolve(),
        err => {
          del.sync([destGlob]);
          reject(err);
        }
      );
  });
};

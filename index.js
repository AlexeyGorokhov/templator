'use strict';

const path = require('path');
const emptyDest = require('./lib/empty-dest');
const getSrcFilePaths = require('./lib/get-src-file-paths');
const renderFile = require('./lib/render-file');

/**
 * Render files
 *
 * @param {String} src - Absolute or relative to process.cwd() path to the folder with template
 *                       files
 * @param {String} dest - Absolute or relative to process.cwd() path to the destination folder
 * @param {Object} data - Data object to be used to replace placeholders in templates
 * @param {Promise<Void>}
 */
module.exports = function (src, dest, data) {
  return new Promise((resolve, reject) => {
    const absSrc = path.resolve(process.cwd(), src);
    const absDest = path.resolve(process.cwd(), dest);

    emptyDest(absDest)
    .then(() => getSrcFilePaths(absSrc))
    .then(srcPaths => Promise.all(srcPaths.map(p => {
      const destFilePath = path.join(absDest, path.relative(absSrc, p));
      return renderFile(p, destFilePath, data);
    })))
    .then(resolve)
    .catch(err => {
      emptyDest(absDest)
      .then(() => reject(err))
      .catch(reject);
    });
  });
};

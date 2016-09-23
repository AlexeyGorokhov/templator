'use strict';

const path = require('path');
const globby = require('globby');

/**
 * Get absolute paths of all root templates
 *
 * @param {String} src - Absolute path to the folder with template files
 * @return {Promise<Array<String>>}
 * @public
 */
module.exports = function (src) {
  return new Promise((resolve, reject) => {
    const srcGlob = [path.join(src, '**/*'), '!**/_*.*'];

    Promise.resolve(globby(srcGlob))
    .then(paths => resolve(paths.filter(p => path.extname(p))))
    .catch(reject);
  });
};

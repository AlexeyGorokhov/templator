'use strict';

const path = require('path');
const del = require('del');

/**
 * Delete everything from the destination folder
 *
 * @param {String} src - Absolute path to the destination folder
 * @return {Promise<Void>}
 * @public
 */

module.exports = function emptyDest (dest) {
  return new Promise((resolve, reject) => {
    const destGlob = path.join(dest, '**');

    Promise.resolve(del([destGlob]))
    .then(() => resolve())
    .catch(reject);
  });
};

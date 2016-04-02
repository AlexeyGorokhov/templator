'use strict';

const fs = require('fs');
const path = require('path');
const Buffer = require('buffer').Buffer;
const Writable = require('stream').Writable;
const through2 = require('through2');

module.exports = transformator;

function transformator (data, srcFilePath) {
  let mainBuf = [];
  let replBuf = [];
  let state = 'out';

  return through2(transform, flush);

  function transform (chunck, enc, cb) {
    const _this = this;
    const len = chunck.length;
    let i = 0;

    iterate();

    function iterate () {
      for (; i < len; i++) {
        step(chunck[i]);

        if (replBuf.length && state === 'out') {
          if (mainBuf.length) {
            _this.push(new Buffer(mainBuf));
            mainBuf = [];
          }
          const tokenString = (new Buffer(replBuf)).toString();
          replace(tokenString, cont);
          i++;
          return;
        }
      }
      if (mainBuf.length) {
        _this.push(new Buffer(mainBuf));
        mainBuf = [];
      }
      cb();
    }

    function cont (err, replacement) {
      if (err) cb(err);
      if (replacement) {
        _this.push(new Buffer(replacement));
      }
      replBuf = [];
      iterate();
    }
  }

  function flush (cb) {
    if (mainBuf.length) this.push(new Buffer(mainBuf));
    this.end();
    cb();
  }

  function step (byte) {
    if (byte === '{'.charCodeAt(0)) {
      if (state === 'out') {
        state = 'start';
        return;
      } else if (state === 'start') {
        state = 'in';
        return;
      }
    } else if (byte === '}'.charCodeAt(0)) {
      if (state === 'in') {
        state = 'end';
        return;
      } else if (state === 'end') {
        state = 'out';
        return;
      }
    } else {
      if (state === 'out') {
        mainBuf.push(byte);
        return;
      } else if (state === 'in') {
        replBuf.push(byte);
        return;
      }
    }
  }

  function replace (token, cb) {
    if (token[0] === '>') {
      renderPartial(token, cb);
    } else {
      try {
        let result = getData(token);
        cb(null, result);
      } catch (e) {
        cb(e);
      }
    }
  }

  function getData (token) {
    let props = token.split('.');
    let val = data;
    props.forEach(p => {
      if (!(p in val)) throw new Error(`No data for ${token}`);
      val = val[p];
    });
    return val;
  }

  function renderPartial (token, cb) {
    const pth = token.slice(1).trim();
    const filePath = path.resolve(path.dirname(srcFilePath), pth);

    partialRenderer(filePath)
    .then(text => {
      cb(null, text);
    }).catch(err => {
      cb(err);
    });
  }

  function partialRenderer (srcFilePath) {
    return new Promise((resolve, reject) => {
      const src = fs.createReadStream(srcFilePath, { encoding: 'utf8' });

      const tr = transformator(data, srcFilePath);
      tr.on('error', (err) => reject(err));

      let result = '';

      const ws = Writable();
      ws._write = (chunck, enc, next) => {
        result += chunck.toString();
        next();
      };
      ws.on('finish', () => {
        resolve(result);
      });

      src.pipe(tr).pipe(ws);
    });
  }
}

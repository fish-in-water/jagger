import utils from 'loader-utils';
import { tgtURL, abs2rel } from '../helpers/utils';

export default function () {
  // if in node env, no lazy load
  if (this.target == 'node') {
    return `
      module.exports = function(cb) {
        cb(require(${utils.stringifyRequest(this, '!!' + this.remainingRequest)}));
      }
    `;
  }
 
  const relpath = abs2rel(this.resourcePath);
  const url = tgtURL(relpath).replace(/\.\w+$/, '');
  return `
    module.exports = function(cb) {
      require.ensure([], function(require) {
        cb(require(${utils.stringifyRequest(this, '!!' + this.remainingRequest)}));
      }, "${url}");
    }
  `;
}



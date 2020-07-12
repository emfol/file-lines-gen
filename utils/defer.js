
/**
 * Utility function to create externally controlled promises
 */

function defer() {
    let reject, resolve, promise = new Promise(function (res, rej) {
        resolve = res;
        reject = rej;
    });
    return Object.freeze({
        reject,
        resolve,
        promise
    });
}

/**
 * Exports
 */

module.exports = defer;

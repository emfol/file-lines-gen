
const fs = require('fs');
const bufferToLines = require('buffer-to-lines');
const defer = require('./utils/defer');

/**
 * Constants
 */

const DEFAULT_ENCODING = 'utf8';
const DEFAULT_BUFFER_SIZE = 4096;

/**
 * API
 */

async function* fileLinesGen(filepath, userOptions) {
    const options = normalizeOptions(userOptions);
    const file = await open(filepath, options);
    try {
        let result;
        do {
            result = await read(file);
            if (!isValidReadResult(result)) throw new Error('Failed reading data...');
            if (result.lines.length > 0) {
                const enough = yield result.lines;
                if (enough === true) break;
            }
        } while (result.done === false);
    } finally {
        await close(file);
    }
}

/**
 * Helpers
 */

function isValidReadResult(subject) {
    return typeof subject === 'object' && subject !== null && Array.isArray(subject.lines);
}

function normalizeOptions(userOptions) {
    const options = Object(userOptions);
    return Object.freeze({
        buffer: Math.abs(parseInt(options.buffer, 10)) || DEFAULT_BUFFER_SIZE,
        encoding: (options.encoding || DEFAULT_ENCODING) + ''
    });
}

async function open(filepath, options) {
    const { promise, resolve, reject } = defer();
    const file = Object.seal({
        fd: -1,
        buffer: null,
        offset: 0,
        encoding: options.encoding
    });
    fs.open(filepath, 'r', function (error, fd) {
        if (error) {
            reject(error);
            return;
        }
        file.fd = fd;
        file.buffer = Buffer.alloc(options.buffer, 0);
        resolve(file);
    });
    return await promise;
}

async function read(file) {
    const { promise, resolve, reject } = defer();
    const { fd, buffer, offset, encoding } = file;
    fs.read(fd, buffer, offset, buffer.length - offset, null, function (error, bytesRead) {
        let done = false, lines = [];
        if (error) {
            reject(error);
            return;
        }
        if (bytesRead > 0) {
            const size = offset + bytesRead;
            file.offset = bufferToLines(buffer, size, encoding, lines);
            if (file.offset === size) {
                // buffer is full and no EOL was found
                file.offset = 0;
                lines.push(buffer.toString(encoding, 0, size));
            }
        } else {
            done = true;
            if (offset > 0) {
                file.offset = 0;
                lines.push(buffer.toString(encoding, 0, offset));
            }
        }
        resolve(Object.freeze({ done, lines }));
    });
    return await promise;
}

async function close(file) {
    const { promise, resolve, reject } = defer();
    fs.close(file.fd, function (error) {
        if (error) {
            reject(error);
            return;
        }
        file.fd = -1;
        file.buffer = null;
        resolve(true);
    });
    return await promise;
}

/**
 * Exports
 */

module.exports = fileLinesGen;

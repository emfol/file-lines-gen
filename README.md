# File Lines Generator

The *file-lines-gen* utility is a simple *Node.js* library that can be used for buffered file reads. Unlike the native solution, it lets the user determine the size of the buffer which will be allocated for each low-level *read* call. The filled buffer will have its lines appended to an array which will then be provided to user all at once (meaning that multiple lines might be available after a single read operation). At the moment, the library provides a single generator function that can be used as described below. Please note that if the provided buffer size is not big enough to hold an entire input line, that line might be split into multiple lines.

## Installation

Using NPM:

```bash
npm install file-lines-gen
```

## Usage

```javascript
const fileLinesGen = require('file-lines-gen');

async function main() {
    const gen = fileLinesGen('path/to/file.txt', {
        buffer: 8192 // 8KiB Buffer
    });
    for await (const lines of gen) {
        console.log('Lines:', lines);
    }
}

main();
```

## License
[ISC](https://choosealicense.com/licenses/isc/)

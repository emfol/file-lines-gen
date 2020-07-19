const path = require('path');
const fileLinesGen = require('./file-lines-gen');

async function main() {
    let gen = fileLinesGen(path.join(__dirname, 'test/ex-1.txt'), {
        buffer: process.argv[2]
    });
    for await (const lines of gen) {
        console.log('Lines:', lines);
    }
}

main();

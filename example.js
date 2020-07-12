const path = require('path');
const fileLinesGen = require('./file-lines-gen');

async function main() {
    let next, gen = fileLinesGen(path.join(__dirname, 'test/ex-1.txt'), {
        buffer: 64
    });

    next = await gen.next();
    console.log('done: %s, value: %s', next.done, next.value);
    
    next = await gen.next();
    console.log('done: %s, value: %s', next.done, next.value);
    
    next = await gen.next();
    console.log('done: %s, value: %s', next.done, next.value);
    
    next = await gen.next();
    console.log('done: %s, value: %s', next.done, next.value);

    next = await gen.next();
    console.log('done: %s, value: %s', next.done, next.value);
}

main();

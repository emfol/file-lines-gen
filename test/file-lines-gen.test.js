const path = require('path');
const fileLinesGen = require('../file-lines-gen');

describe('fileLinesGen', () => {
    it('should correctly parse the exmaple file #1', async () => {
        let next, gen = fileLinesGen(path.join(__dirname, 'ex-1.txt'), {
            buffer: 64
        });

        next = await gen.next();
        expect(next.done).toBe(false);
        expect(next.value).toStrictEqual([
            'What lies behind you',
            'and what lies in front of you,'
        ]);

        next = await gen.next();
        expect(next.done).toBe(false);
        expect(next.value).toStrictEqual(['pales in comparison to what lies inside of you.']);

        next = await gen.next();
        expect(next.done).toBe(false);
        expect(next.value).toStrictEqual(['- Ralph Waldo Emerson']);

        next = await gen.next();
        expect(next.done).toBe(true);
        expect(next.value).toStrictEqual(null);
    });
});

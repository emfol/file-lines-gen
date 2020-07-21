const path = require('path');
const fileLinesGen = require('../file-lines-gen');

describe('fileLinesGen', () => {
    describe('Example #1', () => {
        const FILEPATH = 'ex-1.txt';
        it('should retrieve all lines when buffer is larger than the file', async () => {
            let next, gen = fileLinesGen(path.join(__dirname, FILEPATH), { buffer: 1024 });
            next = await gen.next();
            expect(next.done).toBe(false);
            expect(next.value).toStrictEqual([
                'What lies behind you',
                'and what lies in front of you,',
                'pales in comparison to what lies inside of you.',
                '- Ralph Waldo Emerson'
            ]);
            next = await gen.next();
            expect(next.done).toBe(true);
            expect(next.value).toBe(undefined);
        });
        it('should split lines when buffer is smaller than a line', async () => {
            let next, gen = fileLinesGen(path.join(__dirname, FILEPATH), { buffer: 32 });
            next = await gen.next();
            expect(next.done).toBe(false);
            expect(next.value).toStrictEqual(['What lies behind you']);
            next = await gen.next();
            expect(next.done).toBe(false);
            expect(next.value).toStrictEqual(['and what lies in front of you,']);
            next = await gen.next();
            expect(next.done).toBe(false);
            expect(next.value).toStrictEqual(['pales in comparison to what lies']);
            next = await gen.next();
            expect(next.done).toBe(false);
            expect(next.value).toStrictEqual([' inside of you.']);
            next = await gen.next();
            expect(next.done).toBe(false);
            expect(next.value).toStrictEqual(['- Ralph Waldo Emerson']);
            next = await gen.next();
            expect(next.done).toBe(true);
            expect(next.value).toBe(undefined);
        });
        it('should correctly split lines when buffer is larger than any line', async () => {
            let next, gen = fileLinesGen(path.join(__dirname, FILEPATH), { buffer: 64 });
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
            expect(next.value).toBe(undefined);
        });
    })
    describe('Example #2', () => {
        const FILEPATH = 'ex-2.txt';
        it('should retrieve all lines when buffer is larger than the file', async () => {
            let next, gen = fileLinesGen(path.join(__dirname, FILEPATH), { buffer: 1024 });
            next = await gen.next();
            expect(next.done).toBe(false);
            expect(next.value).toStrictEqual([
                'Whenever you find yourself on the side of the majority,',
                'it is time to reform (or pause and reflect).',
                '― Mark Twain',
                '',
                'The fool doth think he is wise,',
                'but the wise man knows himself to be a fool.',
                '― William Shakespeare, As You Like It',
                '',
                'By three methods we may learn wisdom:',
                'First, by reflection, which is noblest;',
                'Second, by imitation, which is easiest;',
                'and third by experience, which is the bitterest.'
            ]);
            next = await gen.next();
            expect(next.done).toBe(false);
            expect(next.value).toStrictEqual(['― Confucious']);
            next = await gen.next();
            expect(next.done).toBe(true);
            expect(next.value).toBe(undefined);
        });
        it('should correctly split lines when buffer is larger than any line', async () => {
            let next, gen = fileLinesGen(path.join(__dirname, FILEPATH), { buffer: 128 });
            next = await gen.next();
            expect(next.done).toBe(false);
            expect(next.value).toStrictEqual([
                'Whenever you find yourself on the side of the majority,',
                'it is time to reform (or pause and reflect).',
                '― Mark Twain',
                ''
            ]);
            next = await gen.next();
            expect(next.done).toBe(false);
            expect(next.value).toStrictEqual([
                'The fool doth think he is wise,',
                'but the wise man knows himself to be a fool.',
                '― William Shakespeare, As You Like It',
                ''
            ]);
            next = await gen.next();
            expect(next.done).toBe(false);
            expect(next.value).toStrictEqual([
                'By three methods we may learn wisdom:',
                'First, by reflection, which is noblest;',
                'Second, by imitation, which is easiest;'
            ]);
            next = await gen.next();
            expect(next.done).toBe(false);
            expect(next.value).toStrictEqual(['and third by experience, which is the bitterest.']);
            next = await gen.next();
            expect(next.done).toBe(false);
            expect(next.value).toStrictEqual(['― Confucious']);
            next = await gen.next();
            expect(next.done).toBe(true);
            expect(next.value).toBe(undefined);
        });
    })
});

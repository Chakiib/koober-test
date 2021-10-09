import * as fileManager from '../fileManager';

describe('fileManager', () => {
    describe('read', () => {
        test('The promise is rejected', async () => {
            expect.assertions(1);
            try {
                await fileManager.read('program.exe');
            } catch (error) {
                expect(error).toMatch('File not found!');
            }
        });

        test('File data is returned', async () => {
            expect.assertions(1);
            try {
                const expected = [expect.stringMatching(/articles/), expect.stringMatching(/carts/)];

                const data = await fileManager.read('input.json');
                expect(data).toEqual(expect.arrayContaining(expected));
            } catch (error) {}
        });
    });
});

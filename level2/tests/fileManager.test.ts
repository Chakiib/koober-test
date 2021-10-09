import * as fileManager from '../fileManager';

describe('fileManager', () => {
    describe('read', () => {
        test('The promise is rejected if the file does not exit', async () => {
            expect.assertions(1);
            try {
                await fileManager.read('program.exe');
            } catch (error) {
                expect(error).toMatch('File not found!');
            }
        });

        test("The promise is resolved and the file's data is returned", async () => {
            expect.assertions(1);
            try {
                const expected = [
                    expect.stringMatching(/articles/),
                    expect.stringMatching(/carts/),
                    expect.stringMatching(/delivery_fees/),
                ];

                const data = await fileManager.read('input.json');
                expect(data).toEqual(expect.arrayContaining(expected));
            } catch (error) {}
        });
    });

    describe('write', () => {
        test('The promise is resolved', async () => {
            expect.assertions(1);
            try {
                const data = await fileManager.write('output.test.json', '{}');
                expect(data).toBeTruthy();
            } catch (error) {}
        });
    });
});

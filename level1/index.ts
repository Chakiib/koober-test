const main = async () => {
    const { read } = require('./fileManager');

    try {
        const data = await read('input.json');
    } catch (error) {}
};

if (require.main === module) {
    main();
}

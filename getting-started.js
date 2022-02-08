const readline = require('readline'),
    fs = require('fs')

const askQuestion = async (query) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans.trim());
    }))
};


(async () => {
    const endpoint = await askQuestion('What blockchain network do you want to use? '),
        address = await askQuestion('What token address are you creating the API for? '),
        supply = await askQuestion('What is the tokens total supply? '),
        decimals = parseFloat(await askQuestion('What is the tokens decimal amount? ')),
        totalBalances = parseFloat((await askQuestion('How many wallets should be removed from circulating supply? '))),
        balances = {};

    for (let index = 0; index < totalBalances; index++) {
        const id = await askQuestion('Wallet identifier (name)? '),
            addr = await askQuestion('Address of wallet? ');

        balances[id] = addr;
    }

    const info = {
        endpoint,
        token: {
            address,
            supply: `${supply.trim()}${''.padStart(decimals, '0')}`,
            decimals,
        },
        balances
    };

    console.log(JSON.stringify(info, null, 4));

    fs.writeFileSync('src/info.json', JSON.stringify(info, null, 4));
})();


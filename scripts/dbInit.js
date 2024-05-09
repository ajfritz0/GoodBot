const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const currencyShop = require('../src/models/CurrencyShop')(sequelize, Sequelize.DataTypes);
require('../src/models/Users')(sequelize, Sequelize.DataTypes);
require('../src/models/UserItems')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	/*
	const shop = [
		currencyShop.upsert({ name: 'Item 1', cost: 1 }),
		currencyShop.upsert({ name: 'Item 2', cost: 2 }),
		currencyShop.upsert({ name: 'Item 3', cost: 5 }),
	];
	await Promise.all(shop);
	*/

	console.log('Database synced');
	sequelize.close();
}).catch(console.error);
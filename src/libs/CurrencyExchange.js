const { Collection } = require('discord.js');
const { Users } = require('../dbObjects.js');

class CurrencyExchange {
	constructor() {
		this.currency = new Collection();
	}

	async load() {
		const storedBalances = await Users.findAll();
		storedBalances.forEach(b => this.currency.set(b.user_id, b));
	}

	async addBalance(id, amount) {
		const user = this.currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}

		const newUser = await Users.create({ user_id: id, balance: amount });
		this.currency.set(id, newUser);
		return newUser;
	}

	getBalance(id) {
		const user = this.currency.get(id);
		return user ? user.balance : 0;
	}

	transfer(senderId, receiverId, amount) {
		const currentAmount = this.getBalance(senderId);

		if (amount > currentAmount) return new Error('Not enough funds to complete transfer');
		if (amount <= 0) return new Error('Transfer amount cannot be negative');

		this.addBalance(senderId, -amount);
		this.addBalance(receiverId, amount);

		return true;
	}
}

module.exports = CurrencyExchange;
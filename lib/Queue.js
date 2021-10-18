class Queue {
	constructor(arrInitialItems = []) {
		this._queue = arrInitialItems;
	}

	dequeue() {
		if (this._queue.length == 0) return null;
		return this.queue.shift();
	}

	enqueue(value) {
		this._queue.push(value);
	}

	isEmpty() {
		return this._queue.length == 0;
	}

	peak() {
		return (this.isEmpty) ? null : this._queue[0];
	}

	getSize() {
		return this._queue.length;
	}

	find(value) {
		return this._queue.indexOf(value);
	}

	remove(idx) {
		this._queue.splice(idx, 1);
	}

	clearQueue() {
		this._queue = [];
	}
}

module.exports = Queue;
module.exports = class MarkovChain {
    constructor() {
        this._defaultBank = {
            start: [],
            end: [],
            map: {},
        };
        this._minimumLength = 5;
        this._maximumLength = 100;
        this._bank = this._defaultBank;
    }

    _getRandomElement(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    _isAllowed(word) {
        return !word.match(/^(http|\/)/);
    }

    _cleanList(list) {
        return list.filter((word) => {
            return this._isAllowed(word)
        });
    }

    _cleanBank() {
        this._bank.start = this._cleanList(this._bank.start);
        this._bank.end = this._cleanList(this._bank.end);
        Object.keys(this._bank.map).forEach((key) => {
            this._bank.map[key] = this._cleanList(this._bank.map[key]);
        });
    }

    _processText(text) {
        if (typeof text !== 'string' || !text.length) {
            return;
        }

        const words = text.trim().split(' ');

        this._isAllowed(words[0]) && this._bank.start.push(words[0]);
        this._isAllowed(words[words.length - 1]) && this._bank.end.push(words[words.length - 1]);

        for (let w = 0; w < words.length - 1; w++) {
            if (!this._isAllowed(words[w]) ||
                !this._isAllowed(words[w + 1])) {
                continue;
            }
            if (words[w] in this._bank.map) {
                this._bank.map[words[w]].push(words[w + 1]);
            } else {
                this._bank.map[words[w]] = [words[w + 1]];
            }
        }
    }

    clearBank() {
        this._bank = this._defaultBank;
    }

    addPhrase(phrase) {
        this._processText(phrase);
    }

    getPhrase() {
        let currentWord = this._getRandomElement(this._bank.start);
        const phrase = [currentWord];
        let iter = 0;

        while (currentWord in this._bank.map && iter < this._maximumLength) {
            const nextWords = this._bank.map[currentWord];
            currentWord = this._getRandomElement(nextWords);
            phrase.push(currentWord);

            if (currentWord in this._bank.end) {
                break;
            }
            iter += 1;
        }

        return phrase.join(' ');
    }
}
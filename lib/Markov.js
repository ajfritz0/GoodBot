
export default class MarkovChain {
    constructor() {
        this._defaultBank = {
            start: [],
            end: [],
            map: {},
        };
        this._minimumLength = 5;
        this._bank = this._defaultBank;
    }

    _getRandomElement(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    _processText(text) {
        if (typeof text !== 'string' || !text.length) {
            return;
        }

        const words = text.trim().split(' ');

        this._bank.start.push(words[0]);
        this._bank.end.push(words[words.length - 1]);

        for (let w = 0; w < words.length - 1; w++) {
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

        while (currentWord in this._bank.map) {
            const nextWords = this._bank.map[currentWord];
            currentWord = this._getRandomElement(nextWords);
            phrase.push(currentWord);

            if (currentWord in this._bank.end) {
                break;
            }
        }

        return phrase.join(' ');
    }
}

export default class SignNotSupportedException {
    constructor(tokenSource) {
        this.tokenSource = tokenSource;
        this.message = `Символ '${this.tokenSource}' не поддерживается`;
    }

    toString() {
        return this.message;
    }
}

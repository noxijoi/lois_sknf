export default class ParserException {
    constructor(message) {
        this.message = message;
    }

    toString() {
        return this.message;
    }
}

export default class LogicStatementException {
    constructor(message) {
        this.message = message;
    }

    toString() {
        return this.message;
    }
}
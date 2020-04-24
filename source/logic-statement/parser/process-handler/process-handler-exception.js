export default class NoProcessHandlerFoundException {
    constructor(sign) {
        this.sign = sign;
        this.message = `Нет обработчика для этого знака: ${this.sign}`;
    }

    toString() {
        return this.message;
    }
}

export default class ProcessHandler {
    constructor(signType, handler) {
        this.signType = signType;
        this.handler = handler;
    }

    process(sign) {
        return this.handler(sign);
    }
}

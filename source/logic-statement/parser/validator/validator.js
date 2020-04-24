export default class {
    constructor(validationProcessor) {
        this.validationProcessor = validationProcessor;
    }

    validate(signs) {
        return this.validationProcessor(signs);
    }
}

export default class LogicStatementValidator {
  constructor (nodesValidateProcessor) {
    this.nodesValidateProcessor = nodesValidateProcessor;
  }

  validate (logicEntities) {
    return this.nodesValidateProcessor(logicEntities);
  }
}

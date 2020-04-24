import ProcessHandler from 'source/logic-statement/parser/process-handler/process-handler';
import Validator from 'source/logic-statement/parser/validator/validator';
import ValidationMessage from 'source/logic-statement/parser/validator/validation-message';
import NoProcessHandlerFoundException from 'source/logic-statement/parser/process-handler/process-handler-exception';
import Sign from 'source/logic-statement/parser/sign/sign';
import SignChecker from 'source/logic-statement/parser/sign/sign-checker';
import LogicEntity from 'source/logic-statement/parser/logic-entity/logic-entity';
import ParserException from 'source/logic-statement/parser/parser-exception';

export default class Parser {
    constructor() {
        this.processHandlers = [];
        this.validators = [];
        this.signChecker = new SignChecker();
        this.currentSignIndex = 0;
        this.registerHandlers();
        this.registerValidators();
    }

    registerValidators() {
        let bracketValidatorProcessor = function(signs) {
            let bracketCount = 0;
            (signs || []).forEach(function (sign) {
                if (sign.type === Sign.TYPE.OPENING_BRACKET.name) {
                    bracketCount++;
                } else if (sign.type === Sign.TYPE.CLOSING_BRACKET.name) {
                    bracketCount--;
                }
            });

            let isValid = bracketCount === 0;
            let message = isValid ? 'Верное кол-во скобок' : 'Кол-во скобок неверное';

            return new ValidationMessage(isValid, message);
        };

        this.registerValidator(new Validator(bracketValidatorProcessor));
    }

    registerValidator(validator) {
        if (validator) {
            this.validators.push(validator);
        }
    }

    registerHandlers() {
        let self = this;
        let variablesHash = {};

        this.registerHandler(new ProcessHandler(Sign.TYPE.CONST.name, function(sign) {
            let constValueProcessor = function () {
                if (this.signs[0].sourceCode === '0') {
                    return 0;
                }

                return 1;
            };

            return new LogicEntity(LogicEntity.TYPE.CONST, [sign], null, constValueProcessor);
        }));

        this.registerHandler(new ProcessHandler(Sign.TYPE.SYMBOL.name, function(sign) {
            let variableValueProcessor = function () {
                return this.value;
            };

            if (!variablesHash[sign.sourceCode]) {
                variablesHash[sign.sourceCode] = new LogicEntity(LogicEntity.TYPE.VARIABLE, [sign], null, variableValueProcessor);
            }

            return variablesHash[sign.sourceCode];
        }));

        this.registerHandler(new ProcessHandler(Sign.TYPE.NEGATIVE.name, function(sign) {
            return new LogicEntity(LogicEntity.TYPE.UNARY_OPERATOR, [sign]);
        }));

        this.registerHandler(new ProcessHandler(Sign.TYPE.DISJUNCTION.name, function(sign) {
            return  new LogicEntity(LogicEntity.TYPE.BINARY_OPERATOR, [sign])
        }));
        this.registerHandler(new ProcessHandler(Sign.TYPE.CONJUNCTION.name, function(sign) {
            return new LogicEntity(LogicEntity.TYPE.BINARY_OPERATOR, [sign]);
        }));
        this.registerHandler(new ProcessHandler(Sign.TYPE.IMPLICATION.name, function(sign) {
            return new LogicEntity(LogicEntity.TYPE.BINARY_OPERATOR, [sign]);
        }));
        this.registerHandler(new ProcessHandler(Sign.TYPE.EQUIVALENCE.name, function(sign) {
            return new LogicEntity(LogicEntity.TYPE.BINARY_OPERATOR, [sign]);
        }));

        this.registerHandler(new ProcessHandler(Sign.TYPE.OPENING_BRACKET.name, function() {
                    let isEndOfFormula = false;
                    let logicEntities = [];
                    let resultNode = null;

                    while (!self.isLastSign() && !isEndOfFormula) {
                        let nextToken = self.getNextSign();
                        try {
                            let logicEntity = self.processSign(nextToken);

                            if (logicEntity) {
                                logicEntities.push(logicEntity);
                            }
                        } catch (e) {
                            if (e.sign && e.sign.type === Sign.TYPE.CLOSING_BRACKET.name) {
                                isEndOfFormula = true;
                            }
                        }
                    }

                    let unaryValueProcessor = function () {
                        return this.childrenNodes[1].getValue() ? 0 : 1;
                    };

                    let binaryValueProcessor = function () {
                        let binaryOperatorType = this.childrenNodes[1].signs[0].type;
                        let leftValue  = this.childrenNodes[0].getValue();
                        let rightValue = this.childrenNodes[2].getValue();

                        if (binaryOperatorType === Sign.TYPE.CONJUNCTION.name) {
                            return leftValue && rightValue;
                        } else if (binaryOperatorType === Sign.TYPE.DISJUNCTION.name) {
                            return leftValue || rightValue;
                        } else if (binaryOperatorType === Sign.TYPE.IMPLICATION.name) {
                            if (leftValue === 0) {
                                return 1;
                            } else if (rightValue === 1) {
                                return 1;
                            }

                            return 0;
                        } else if (binaryOperatorType === Sign.TYPE.EQUIVALENCE.name) {
                            return (leftValue === rightValue) ? 1 : 0;
                        }
                    };

                    if (logicEntities.length === 3 && logicEntities[1].type === LogicEntity.TYPE.BINARY_OPERATOR) {
                        resultNode = new LogicEntity(LogicEntity.TYPE.BINARY_COMPLEX_FORMULA, null, logicEntities, binaryValueProcessor);
                    } else if (logicEntities.length === 2 && logicEntities[0].type === LogicEntity.TYPE.UNARY_OPERATOR) {
                        resultNode = new LogicEntity(LogicEntity.TYPE.UNARY_COMPLEX_FORMULA, null, logicEntities, unaryValueProcessor);
                    } else throw new ParserException('Данное выражение не является формулой');

                    return resultNode;
                }));
    }

    registerHandler(handler) {
      if (handler) {
        this.processHandlers.push(handler);
      }
    }

    parse(sourceCode) {
        this.sourceCode = sourceCode;
        this.signs = this.signChecker.createSign(this.sourceCode);
        this.validateSigns();
        this.logicEntities = this.createLogicEntities();

        return this.logicEntities;
    }

    validateSigns() {
        let signs = this.signs;

        return (this.validators || []).every(function (validator) {
            let result = validator.validate(signs);

            if (!result.isValid) {
                throw new ParserException(result.message);
            }

            return true;
        });
    }

    createLogicEntities() {
        let currentSign = this.getNextSign();
        let logicEntity = null;
        let logicEntities = [];

        while (!this.isLastSign()) {
            logicEntity = this.processSign(currentSign);
            logicEntities.push(logicEntity);
            currentSign = this.getNextSign();
        }

        return logicEntities;
    }

    processSign(sign) {
        if (sign) {
            let handler = null;
            let logicEntity = null;

            (this.processHandlers || []).some(function(someHandler) {
                if (someHandler.signType === sign.type) {
                    handler = someHandler;

                    return true;
                }
            });

            if (handler) {
                logicEntity = handler.process(sign);

                return logicEntity;
            } else {
                throw new NoProcessHandlerFoundException(sign);
            }
        }
    }

    isLastSign() {
        return this.currentSignIndex === this.signs.length + 1;
    }

    getNextSign() {
        if (!this.isLastSign()) {
            return this.signs[this.currentSignIndex++];
        }
    }
}

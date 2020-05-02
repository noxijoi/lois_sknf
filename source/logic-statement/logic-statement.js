import Parser from 'source/logic-statement/parser/parser';
import LogicEntity from 'source/logic-statement/parser/logic-entity/logic-entity';
import LogicStatementValidator from 'source/logic-statement/validator/logic-statement-validator';
import LogicStatementException from 'source/logic-statement/exception/logic-statement-exception';
import ValidationMessage from 'source/logic-statement/parser/validator/validation-message';
import Sign from 'source/logic-statement/parser/sign/sign';
import * as _ from "lodash"

function divideConjunctions(logicEntity, arr) {
    if (logicEntity.type === LogicEntity.TYPE.BINARY_COMPLEX_FORMULA) {
        let children = logicEntity.childrenLogicEntities;
        if (children[1].type === LogicEntity.TYPE.BINARY_OPERATOR
            && children[1].signs[0].type === Sign.TYPE.DISJUNCTION.name) {
            divideConjunctions(children[0], arr);
            divideConjunctions(children[2], arr);
        } else {
            arr.push(logicEntity);
            return arr;
        }
    }
    return arr;
}

function getAllVariables(logicEntity, arr = []) {
    switch (logicEntity.type) {
        case LogicEntity.TYPE.BINARY_COMPLEX_FORMULA:
        case LogicEntity.TYPE.FORMULA:
        case LogicEntity.TYPE.UNARY_COMPLEX_FORMULA:
            logicEntity.childrenLogicEntities.forEach(logicEntity => getAllVariables(logicEntity, arr));
            break;
        case LogicEntity.TYPE.VARIABLE:
            arr.push(logicEntity.signs[0].sourceCode);
            return arr;
    }
    return arr;
}

function checkCVariablonjunctionsVariables(disjunctions) {
    let variables = [];
    disjunctions.forEach(formula => {
        let formulaVars = getAllVariables(formula);
        variables.push(formulaVars);
    });
    let match = true;
    for (let i = 0; i < variables.length - 1; i++) {
        for (let j = 1; j < variables.length; j++) {
            match = match && (_.xor(variables[i], variables[j]).length === 0);
            match = match && (variables[i].length == variables[j].length);
        }
    }
    return match;
}

function checkOperationType(logicEntity, operationNames = [Sign.TYPE.DISJUNCTION.name]) {
    let correct = false;
    if (logicEntity.type === LogicEntity.TYPE.BINARY_COMPLEX_FORMULA) {
        let operator = logicEntity.childrenLogicEntities[1];
        let operatorType = operator.signs[0].type;
        if (_.includes(operationNames, operatorType)) {
            let newOperationNames = [];
            if (operatorType === Sign.TYPE.DISJUNCTION.name) {
                newOperationNames = [Sign.TYPE.DISJUNCTION.name, Sign.TYPE.CONJUNCTION.name];
                logicEntity.childrenLogicEntities.forEach(logicEntity => correct = true && checkOperationType(logicEntity, newOperationNames));
            }
        } else {
            return false;
        }
        return true;
    }
    return correct;
}


function checkConjunctions(logicEntity) {
    let correct = true;
    if (logicEntity.type === LogicEntity.TYPE.BINARY_COMPLEX_FORMULA) {
        let operator = logicEntity.childrenLogicEntities[1];
        let operatorType = operator.signs[0].type;
        if (operatorType === Sign.TYPE.CONJUNCTION.name) {
            logicEntity.childrenLogicEntities.forEach(logicEntity => correct = correct && checkConjunctions(logicEntity));

        } else {
            return false;
        }
    }
    return correct;
}

export default class LogicStatement {
    constructor(sourceCode) {
        this.parser = new Parser();
        this.validators = [];
        this.logicEntities = this.parser.parse(sourceCode);
        if (this.logicEntities.length !== 1) {
            throw new LogicStatementException("Неверное выражение");
        }
        this.registerValidators();
        this.validateLogicEntities();
        this.variables = this.getVariables();
    }

    registerValidators() {
        let binaryOperatorPositionValidateProcessor = function (logicEntities) {
            if (logicEntities && logicEntities.length === 3) {
                let isNotLeftLogicEntityOperator = logicEntities[0].type !== LogicEntity.TYPE.BINARY_OPERATOR && logicEntities[0].type !== LogicEntity.TYPE.UNARY_OPERATOR;
                let isCentralLogicEntityBinaryOperator = logicEntities[1].type === LogicEntity.TYPE.BINARY_OPERATOR;
                let isNotRightLogicEntityOperator = logicEntities[2].type !== LogicEntity.TYPE.BINARY_OPERATOR && logicEntities[2].type !== LogicEntity.TYPE.UNARY_OPERATOR;
                let isValid = isNotLeftLogicEntityOperator && isCentralLogicEntityBinaryOperator && isNotRightLogicEntityOperator;

                return new ValidationMessage(isValid, isValid ? '' : 'Binary operator at not allowed position!');
            }

            return new ValidationMessage(true, 'Nothing to validate');
        };

        this.registerValidator(new LogicStatementValidator(binaryOperatorPositionValidateProcessor));
    }

    registerValidator(validator) {
        if (validator) {
            this.validators.push(validator);
        }
    }

    validateLogicEntities() {
        return this.reqursiveValidate(this.logicEntities);
    }

    reqursiveValidate(logicEntities) {
        let self = this;

        return (logicEntities || []).every(function (logicEntity) {
            let childrenLogicEntities = logicEntity.childrenLogicEntities;
            let isChildrenLogicEntitiesValid = true;
            if (childrenLogicEntities) {
                isChildrenLogicEntitiesValid = self.reqursiveValidate(childrenLogicEntities);
            }

            return isChildrenLogicEntitiesValid && (self.validators || []).every(function (validator) {
                let result = validator.validate(childrenLogicEntities);

                if (!result.isValid) {
                    throw new LogicStatementException(result.message);
                }

                return true;
            });
        });
    }

    valiablesHash(logicEntities, variablesHash) {
        let self = this;

        (logicEntities || []).forEach(function (logicEntity) {
            if (logicEntity.childrenLogicEntities) {
                let childrenLogicEntities = logicEntity.childrenLogicEntities;

                self.valiablesHash(childrenLogicEntities, variablesHash);
            }

            if (logicEntity.type === LogicEntity.TYPE.VARIABLE && logicEntity.signs.length === 1) {
                let variableSourceCode = logicEntity.signs[0].sourceCode;

                if (!variablesHash[variableSourceCode]) {
                    variablesHash[variableSourceCode] = logicEntity;
                }
            }
        });
    }

    getVariables() {
        let variables = [];
        if (this.isFormula()) {
            let variablesHash = {};
            this.valiablesHash(this.logicEntities, variablesHash);

            for (let property in variablesHash) {
                if (variablesHash.hasOwnProperty(property)) {
                    variables.push(variablesHash[property]);
                }
            }
        }

        return variables;
    }


    isFormula() {
        if (this.logicEntities.length === 1) {
            let logicEntity = this.logicEntities[0];

            return logicEntity.type === LogicEntity.TYPE.CONST ||
                logicEntity.type === LogicEntity.TYPE.VARIABLE ||
                logicEntity.type === LogicEntity.TYPE.UNARY_COMPLEX_FORMULA ||
                logicEntity.type === LogicEntity.TYPE.BINARY_COMPLEX_FORMULA
        }
    }

    getValue() {
        if (this.isFormula()) {
            return this.logicEntities[0].getValue();
        }

        return null;
    }

    isSDNF() {
        if (!checkOperationType(this.logicEntities[0])) {
            return false;
        }
        let conjunctions = divideConjunctions(this.logicEntities[0], []);
        for (let i = 0; i < conjunctions.length; i++) {
            if(!checkConjunctions(conjunctions[i])){
                return false;
            }
        }
        if (!checkCVariablonjunctionsVariables(conjunctions)) {
            return false;
        }
        console.log(conjunctions);
        return true;
    }



}
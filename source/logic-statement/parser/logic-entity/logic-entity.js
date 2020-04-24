export default class LogicEntity {
    constructor(type, signs, childrenLogicEntities, valueProcessor) {
        this.type = type;
        this.signs = signs;
        this.childrenLogicEntities = childrenLogicEntities;
        this.valueProcessor = valueProcessor;
        this.value = 0;
    }

    toString() {
        let line = this.type + ': \n';

        (this.signs || []).forEach(function(sign) {
            line += '\t' + sign.toString() + '\n';
        });

        (this.childrenLogicEntities || []).forEach(function(logicEntity) {
            line += '\t\t' + logicEntity.toString();
        });

        return line;
    }

    getValue() {
        return this.valueProcessor && this.valueProcessor.apply(this);
    }

    setValue(value) {
        if (this.type === LogicEntity.TYPE.VARIABLE) {
            this.value = value;
        }
    }

    equals(secondLogicEntity) {
        if(!secondLogicEntity) {
            return false;
        }

        let isSameTypes = this.type === secondLogicEntity.type;
        let haveChildrenLogicEntities = this.childrenLogicEntities && secondLogicEntity.childrenLogicEntities;

        if(!isSameTypes) {
            return false;
        }

        if(!haveChildrenLogicEntities) {
            return true;
        }

        if(this.childrenLogicEntities.length !== secondLogicEntity.childrenLogicEntities.length) {
            return false;
        }

        for(let i = 0; i < this.childrenLogicEntities.length; i++) {
            if(!this.childrenLogicEntities[i].equals(secondLogicEntity.childrenLogicEntities[i])) {
                return false;
            }
        }
        return true;
    }
}
    LogicEntity.TYPE = {
    CONST: 'CONST',
    VARIABLE: 'VARIABLE',
    UNARY_OPERATOR: 'UNARY_OPERATOR',
    BINARY_OPERATOR: 'BINARY_OPERATOR',
    ATOM: 'ATOM',
    UNARY_COMPLEX_FORMULA: 'UNARY_COMPLEX_FORMULA',
    BINARY_COMPLEX_FORMULA: 'BINARY_COMPLEX_FORMULA',
    FORMULA: 'FORMULA'
};

export default class Sign {
    constructor(type, sourceCode) {
        this.type = type;
        this.sourceCode = sourceCode;
    }

    toString() {
        return this.type + ' = ' + this.sourceCode;
    }
}

Sign.AvailableSymbolRegex = /[0-1,A-Z,\&,\!\|\(\)\~\!\-\>]/;
Sign.TYPE = {
    CONST: {
        name: 'CONST',
        regex: /[0,1]/
    },
    SYMBOL: {
        name: 'SYMBOL',
        regex: /[A-Z]/
    },
    NEGATIVE: {
        name: 'NEGATIVE',
        regex: /!/
    },
    CONJUNCTION: {
        name: 'CONJUNCTION',
        regex: /&/
    },
    DISJUNCTION: {
        name: 'DISJUNCTION',
        regex: /\|/
    },
    IMPLICATION: {
        name: 'IMPLICATION',
        regex: /->/
    },
    EQUIVALENCE: {
        name: 'EQUIVALENCE',
        regex: /~/
    },
    OPENING_BRACKET: {
        name: 'OPENING_BRACKET',
        regex: /\(/
    },
    CLOSING_BRACKET: {
            name: 'CLOSING_BRACKET',
            regex: /\)/
        }
    };
Sign.RULES = [
    Sign.TYPE['CONST'],
    Sign.TYPE['SYMBOL'],
    Sign.TYPE['NEGATIVE'],
    Sign.TYPE['CONJUNCTION'],
    Sign.TYPE['DISJUNCTION'],
    Sign.TYPE['IMPLICATION'],
    Sign.TYPE['EQUIVALENCE'],
    Sign.TYPE['OPENING_BRACKET'],
    Sign.TYPE['CLOSING_BRACKET']
];

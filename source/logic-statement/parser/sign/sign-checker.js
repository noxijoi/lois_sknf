import Sign from 'source/logic-statement/parser/sign/sign';
import SignNotSupportedException from 'source/logic-statement/parser/sign/sign-not-supported-exception';

export default class SignChecker {
    constructor() {}

    createSign(sourceCode) {
        let self = this;
        let signs = [];
        let currentSignSource = '';

        ((sourceCode || '').split('') || []).forEach(function(character) {
            currentSignSource += self.getSignSource(character);
            let sign = self.getSign(currentSignSource);

            if (sign) {
                signs.push(sign);
                currentSignSource = '';
            } else if (currentSignSource !== '-') {
                throw new SignNotSupportedException(character);
            }
        });

        return signs;
    }

    getSignSource(character) {
        return Sign.AvailableSymbolRegex.test(character) ? character : '';
    }

    getSign(source) {
        let resultSign = null;

        (Sign.RULES || []).some(function(signRule) {
            if (signRule.regex.test(source)) {
                resultSign = new Sign(signRule.name, source);

                return true;
            }
        });

        return resultSign;
    }
}

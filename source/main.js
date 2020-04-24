import LogicStatement from 'source/logic-statement/logic-statement';
import {tests} from "./test-examples";
import * as _ from "lodash"
//import Sign from 'source/logic-statement/parser/sign/sign';


let inputContainer = document.getElementById('input_value');
let messageContainer = document.getElementById('result_message');
let calculateButton = document.getElementById('calculate_button');

let testMessage = document.getElementById('test-result');
let nextTestButton = document.getElementById('next-test');
let yesTestButton = document.getElementById('yes-test');
let noTestButton = document.getElementById('no-test');

let errorClass = 'error';
let successClass = 'success';

inputContainer.onkeypress = function () {
    messageContainer.innerText = '';
    messageContainer.classList.remove(errorClass);
    messageContainer.classList.remove(successClass);
};

calculateButton.onclick = function () {
    let sourceCode = inputContainer.value;
    try {
        let statement = new LogicStatement(sourceCode);
//        let a = statement.isFormula();
        console.log(statement);
        let isSKNF = statement.isSKNF();
         if (isSKNF) {/*let logicEntities = this.logicEntities[0].childrenLogicEntities;
        if (!logicEntities || logicEntities.length < 1) {
            return false;
        }
        */
        /*if (!this.isOnlySelectedTypes(logicEntities, LogicEntity.TYPE.BINARY_COMPLEX_FORMULA, Sign.TYPE.CONJUNCTION.name)) {
            return false;
        }*/
       /* console.log("types are right");
        let formulas = this.getAllSelectedLogicEntities(logicEntities, LogicEntity.TYPE.BINARY_COMPLEX_FORMULA)

        if (!this.isCorrectDisjunctions(formulas)) {
            return false;
        }
        console.log("disjunctions are right");
        let binaryFormulas = this.isContainsBinaryComplexFormulas(formulas);

        if (binaryFormulas || binaryFormulas.length > 0) {
            if (this.containsAllVariables(binaryFormulas)) {
                console.log("c1");
                if (this.isHaveSameLogicEntities(binaryFormulas)) {
                    console.log("c2");
                    if (this.isHaveSameLogicEntities(formulas)) {
                        console.log("c3");
                        return false;
                    }
                }
            } else {
                return false;
            }
        }

        if (!this.containsAllVariables(formulas)) {
            return false;
        }
        console.log("c4");
        if (this.isHaveSameLogicEntities(formulas)) {
            return false;
        }
        console.log("c5");
        return true;*/
            messageContainer.classList.add(successClass);
            messageContainer.innerText = 'Данная формула является СКНФ\n';
        } else {
            messageContainer.innerText = 'Данная формула НЕ является СКНФ\n';
        }
    } catch (e) {
        messageContainer.classList.add(errorClass);
        messageContainer.innerText = e.message;
    }
};

nextTestButton.onclick = function (){
  let randomFormula = _.sample(tests);
  let formulaContainer = document.getElementById('test-formula');
  console.log(randomFormula);
  formulaContainer.innerText = randomFormula.value;
  formulaContainer.value = randomFormula.isSKNF;
    testMessage.innerText ='';

};

yesTestButton.onclick = function () {
    let formulaContainer = document.getElementById('test-formula');
    let rightRes = formulaContainer.value;
    if(rightRes){
        testMessage.innerText ='You are right!';
    } else {
        testMessage.innerText = 'You are wrong!';
    }
};

noTestButton.onclick = function () {
    let formulaContainer = document.getElementById('test-formula');
    let rightRes = formulaContainer.value;
    if(rightRes){
        testMessage.innerText = 'You are wrong!';
    } else {
        testMessage.innerText ='You are right!';
    }
};
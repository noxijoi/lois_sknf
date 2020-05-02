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
        console.log(statement);
        let isSDNF = statement.isSDNF();
         if (isSDNF) {
            messageContainer.classList.add(successClass);
            messageContainer.innerText = 'Данная формула является СДНФ\n';
        } else {
            messageContainer.innerText = 'Данная формула НЕ является СДНФ\n';
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
  formulaContainer.value = randomFormula.isSDNF;
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
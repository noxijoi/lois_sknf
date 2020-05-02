export const tests = [
    {
        value:'((A?B)|((!A)&B))',
        isSDNF: true
    },
    {
        value:'((A&B)|((!A)&D))',
        isSDNF: false
    },
    {
        value:'((((A&B)&C)|(((!A)&B)&C))|((A&B)&(!C)))',
        isSDNF: false
    }
];

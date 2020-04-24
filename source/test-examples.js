export const tests = [
    {
        value:'((A|B)&((!A)|B))',
        isSKNF: true
    },
    {
        value:'((A|B)&((!A)|D))',
        isSKNF: false
    },
    {
        value:'((((A|B)|C)&(((!A)|B)|C))&((A|B)|(!C)))',
        isSKNF: false
    }
];

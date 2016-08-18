var ret = handle([1,1,1,2,2,3,3,2,3,5,6,7,31,31], [], 1);
console.log(calculateAllResult(ret,0,1,0,true,0,[37,9,5]));

ret = handle([11,11,11,12,13,14,15,16,17,18,19,19,19,13], [], 11);
console.log(calculateAllResult(ret,0,1,0,true,0,[37,9,5]));

ret = handle([1,1], [2,3,4,5], 1);
console.log(calculateAllResult(ret,0,1,0,true,0,[37,9,5]));

ret = handle([41,41], [31,33,35,37], 41);
console.log(calculateAllResult(ret,0,1,0,true,0,[37,9,5]));

ret = handle([1,1,1,1,2,3,4,5,6,5,5], [9], 1);
console.log(calculateAllResult(ret,0,1,0,true,0,[37,9,5]));

ret = handle([43,43,9,1,1,19,9,19,31,35,31,35,37,37], null, 35);
console.log(calculateAllResult(ret,0,1,0,true,0,[37,9,5]));

ret = handle([1,2,3,7,8,9,41,41,41,43,43,43,45,45], null, 1);
console.log(calculateAllResult(ret,null,1,3,false,1,[45]));

ret = handle([43,45,9,1,11,19,29,21,31,33,31,35,37,41], null, 31);
console.log(calculateAllResult(ret,0,1,0,true,0,[37,9,5]));

ret = handle([1,2,3,2,3,4,15,16,17,13,14,15,35,35], null, 2);
console.log(calculateAllResult(ret,3,6,8,false,2,[37,9,6]));

console.log(dropTenpai([11,11,11,12,13,14,15,16,17,18,19,19,19,21], []));
console.log(dropTenpai([11,12], [1,2,3,4]));
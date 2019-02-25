//확률 테스트

let aaa=[]
for(let i=0;i<10000;i++){
let b = [Math.floor( Math.random() * 3 )]
if( typeof aaa[b] == 'undefined' ) aaa[b] = 0
aaa[b]++}
let total0 = 0;
for(let v of aaa){total0 += v;}
bbb = aaa.map(t => t/total0 * 100);
console.log(bbb)
let total1 = 0
for(let v of bbb){total1 += v;}
console.log(total1)
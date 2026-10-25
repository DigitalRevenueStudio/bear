
const assert=require('assert');const {diagnose}=require('./engine.js');const roster=require('./heroes.json');
const march=(name='Jessie',skill=5,role='join')=>({role,heroes:[{name,skill},{name:'',skill:1},{name:'',skill:1}],troops:['100','200','300'],capacity:''});
const state=()=>({generation:7,simultaneous:true,available:['1000','1000','1000'],marches:[march()]});let count=0;
function test(name,fn){fn();console.log('PASS '+name);count++;}
test('reviewed Jessie gives +25% damage, no setup errors',()=>{const r=diagnose(state(),roster);assert(!r.issues.some(x=>x.level==='error'));assert(r.notes.some(x=>x.includes('+25%')));});
test('defensive first skill flagged',()=>{const s=state();s.marches=[march('Sergey')];assert(diagnose(s,roster).issues.some(x=>x.text.includes('not an offensive')));});
test('unreviewed hero is unknown, not rejected',()=>{const s=state();s.marches=[march('Bradley')];assert(diagnose(s,roster).issues.some(x=>x.level==='unknown'&&x.text.includes('Bradley')));});
test('simultaneous hero reuse rejected',()=>{const s=state();s.marches.push(march());assert(diagnose(s,roster).issues.some(x=>x.level==='error'&&x.text.includes('already assigned')));});
test('alternative reuse allowed',()=>{const s=state();s.simultaneous=false;s.marches.push(march());assert(!diagnose(s,roster).issues.some(x=>x.text.includes('already assigned')));});
test('inventory over-allocation detected',()=>{const s=state();s.available=['0','0','0'];assert(diagnose(s,roster).issues.filter(x=>x.level==='error').length===3);});
test('capacity breach detected',()=>{const s=state();s.marches[0].capacity='500';assert(diagnose(s,roster).issues.some(x=>x.text.includes('exceed entered capacity')));});
test('generation mismatch detected',()=>{const s=state();s.marches=[march('Aiden')];assert(diagnose(s,roster).issues.some(x=>x.text.includes('above your selected generation')));});
test('duplicate class detected',()=>{const s=state();s.marches[0].heroes[1]={name:'Molly',skill:1};assert(diagnose(s,roster).issues.some(x=>x.text.includes('duplicate Lancer')));});
test('leader requires three heroes',()=>{const s=state();s.marches=[march('Jessie',5,'lead')];assert(diagnose(s,roster).issues.some(x=>x.text.includes('select all three')));});
test('decimal troops rejected',()=>{const s=state();s.marches[0].troops[0]='1.2';assert(diagnose(s,roster).issues.some(x=>x.text.includes('whole numbers')));});
test('blank inventory is incomplete',()=>{const s=state();s.available=['','',''];assert(diagnose(s,roster).issues.some(x=>x.text.includes('inventory is incomplete')));});
test('skill level 4 warning',()=>{const s=state();s.marches=[march('Jessie',4)];assert(diagnose(s,roster).issues.some(x=>x.text.includes('below Lv5')));});
test('no marches invalid',()=>{const s=state();s.marches=[];assert(diagnose(s,roster).issues.some(x=>x.text.includes('at least one')));});
console.log(count+' rule tests passed');

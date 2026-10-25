function diagnose(state, roster) {
 const byName=Object.fromEntries(roster.map(h=>[h.name,h])); const issues=[], notes=[], used={}; const totals=[0,0,0];
 function flag(level,text){issues.push({level,text});}
 const gen=Number(state.generation); if(!Number.isInteger(gen)||gen<1||gen>17)flag('error','Choose a generation from 1 to 17.');
 let leadCount=0;
 state.marches.forEach((m,i)=>{
  const label=`March ${i+1} (${m.role==='lead'?'leader':'joiner'})`; if(m.role==='lead')leadCount++;
  const chosen=m.heroes.filter(x=>x.name);const classes=[];
  if(m.role==='lead'&&chosen.length!==3)flag('error',`${label}: select all three leader heroes.`);
  if(m.role==='join'&&!m.heroes[0].name)flag('warning',`${label}: no first-slot hero selected. No hero-skill contribution is being evaluated. Confirm any troops-only joining policy with your captain.`);
  m.heroes.forEach((slot,j)=>{
   if(!slot.name)return;const h=byName[slot.name];if(!h){flag('error',`${label}: unknown hero ${slot.name}.`);return;}
   if(h.gen>gen)flag('error',`${label}: ${h.name} is Gen ${h.gen}, above your selected generation.`);
   if(classes.includes(h.cls))flag('error',`${label}: duplicate ${h.cls} class. Use no more than one hero per class in a march.`);classes.push(h.cls);
   if(used[h.name]!==undefined){if(used[h.name]===i||state.simultaneous)flag('error',`${label}: ${h.name} is already assigned ${used[h.name]===i?'within this march':`to March ${used[h.name]+1}`}.`);}else used[h.name]=i;
   if(!Number.isInteger(Number(slot.skill))||Number(slot.skill)<1||Number(slot.skill)>5)flag('error',`${label}: ${h.name} needs a first Expedition skill level of 1–5.`);
  });
  if(m.role==='lead')notes.push(`${label}: all three heroes’ Expedition kits matter. This version checks structure, not the strongest leader trio. Compare complete skills, stars, exclusive gear and actual battle reports; first-skill levels alone are insufficient.`);
  if(m.role==='join'&&m.heroes[0].name){
   const s=m.heroes[0],h=byName[s.name];
   if(h){
    if(['damage','attack'].includes(h.kind)){
     const value=h.values[Number(s.skill)-1];notes.push(`${label}: ${h.name}, first Expedition skill Lv${s.skill}: ${h.effect} +${value}%. Offensive contribution candidate IF selected among the rally’s four joining skills. This is a skill value, not predicted final damage.`);
     if(Number(s.skill)<5)flag('warning',`${label}: this first skill is below Lv5. A higher-level joining skill can take priority; inspect the rally skill panel.`);
    }else if(h.kind==='defensive')flag('warning',`${label}: ${h.name} first skill provides ${h.effect.toLowerCase()}, not an offensive damage bonus. It may compete for a selected joining-skill slot; follow captain instructions.`);
    else flag('unknown',`${label}: ${h.name} first-slot effect is unreviewed in this version. This does NOT mean the hero is bad. Check the first Expedition tooltip and alliance instructions; no automated suitability verdict is made.`);
    if(h.source)notes.push(`${label} source: ${h.source}`);
   }
   if(chosen.length>1)notes.push(`${label}: heroes in slots 2–3 do not add their first skills to the rally’s four joining-skill contributions. This is not a blanket claim that those slots have no other deployment relevance.`);
  }
  const nums=m.troops.map(Number); if(nums.some(n=>!Number.isSafeInteger(n)||n<0))flag('error',`${label}: troop counts must be non-negative whole numbers.`);
  else{
   nums.forEach((n,j)=>totals[j]+=n);const sum=nums.reduce((a,b)=>a+b,0);
   if(sum===0)flag('warning',`${label}: no troops entered. Allocation checks are incomplete.`);
   if(m.capacity!==''&&(!Number.isSafeInteger(Number(m.capacity))||Number(m.capacity)<0))flag('error',`${label}: deployment capacity must be a non-negative whole number or blank.`);
   else if(m.capacity!==''&&sum>Number(m.capacity))flag('error',`${label}: ${sum.toLocaleString()} troops exceed entered capacity ${Number(m.capacity).toLocaleString()}.`);
   if(sum>0)notes.push(`${label}: ${sum.toLocaleString()} troops; I/L/M = ${nums.map(n=>(100*n/sum).toFixed(1)+'%').join(' / ')}. Descriptive only: no universal optimal ratio is asserted.`);
  }
 });
 if(!state.marches.length)flag('error','Add at least one march.');
 if(leadCount>1&&state.simultaneous)flag('warning','More than one leader march entered as simultaneous. Check your actual rally and march restrictions; this tool does not validate them.');
 if(state.simultaneous){state.available.forEach((v,j)=>{
  if(v==='')return;const n=Number(v);if(!Number.isSafeInteger(n)||n<0)flag('error','Available troop counts must be non-negative whole numbers or blank.');
  else if(totals[j]>n)flag('error',`${['Infantry','Lancer','Marksman'][j]} allocated: ${totals[j].toLocaleString()}, but only ${n.toLocaleString()} entered as available.`);
 });if(state.available.some(v=>v===''))flag('unknown','Available inventory is incomplete. Troop availability cannot be fully checked.');}
 else notes.push('Alternative setups mode: cross-march hero reuse is allowed and troop totals are not treated as a simultaneous inventory requirement.');
 notes.push('Four joining skill slots belong to the whole rally, not four per player. Highest first-skill levels are selected. Tie-breaking is deliberately not predicted: inspect the yellow flag / rally skill panel.');
 return {issues,notes,totals};
}
if(typeof module!=='undefined')module.exports={diagnose};

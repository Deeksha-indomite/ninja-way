import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./about";
import Contact from "./Contact";
import { motion, AnimatePresence } from "framer-motion";
import{supabase}from'./supabase'
const DEFAULT_TASKS = [
  { id:1, time:"6:00 AM",         task:"Wake Up",            icon:"🌅", xp:10, chakra:5,  category:"morning"  },
  { id:2, time:"6:15 AM",         task:"Revision Training",  icon:"📖", xp:20, chakra:15, category:"study"    },
  { id:3, time:"8:00 AM–5:00 PM", task:"Academy (College)",  icon:"🏯", xp:50, chakra:30, category:"academy"  },
  { id:4, time:"6:30 PM",         task:"Ninjutsu Session 1", icon:"⚔️", xp:30, chakra:20, category:"training" },
  { id:5, time:"8:00 PM",         task:"Ninjutsu Session 2", icon:"🔥", xp:30, chakra:20, category:"training" },
  { id:6, time:"9:00 PM",         task:"Scroll Study",       icon:"📝", xp:20, chakra:10, category:"study"    },
  { id:7, time:"10:00 PM",        task:"Meditate & Reflect", icon:"🌙", xp:15, chakra:10, category:"evening"  },
];
const RANKS=[{name:"Academy Student",min:0,color:"#9ca3af",badge:"📜",title:"Novice Shinobi"},{name:"Genin",min:50,color:"#10b981",badge:"🟢",title:"Rookie Ninja"},{name:"Chunin",min:100,color:"#3b82f6",badge:"🔵",title:"Mid-Level Ninja"},{name:"Jonin",min:150,color:"#8b5cf6",badge:"💜",title:"Elite Ninja"},{name:"ANBU",min:175,color:"#f59e0b",badge:"🟡",title:"Shadow Operative"},{name:"Hokage",min:220,color:"#ef4444",badge:"🔴",title:"Village Leader"}];
const VILLAINS=[{name:"Orochimaru",title:"Sannin of Shadows",maxHp:120,img:"🐍",color:"#8b5cf6",minXp:0,reward:50,quote:"Power is the only truth in this world.",moves:["🌫️ Poison Mist","🐍 Snake Bind","💀 Death Jutsu"]},{name:"Zabuza Momochi",title:"Demon of the Hidden Mist",maxHp:200,img:"🌊",color:"#06b6d4",minXp:25,reward:65,quote:"Those who abandon their comrades are worse than trash.",moves:["🌊 Water Dragon","⚔️ Silent Killing","🌫️ Hidden Mist"]},{name:"Itachi Uchiha",title:"Phantom of Akatsuki",maxHp:280,img:"🌑",color:"#3b82f6",minXp:50,reward:80,quote:"You lack hatred.",moves:["👁️ Sharingan","🔥 Amaterasu","🌀 Tsukuyomi"]},{name:"Pain (Nagato)",title:"Six Paths of Pain",maxHp:450,img:"⚡",color:"#dc2626",minXp:100,reward:130,quote:"Those who know true pain can know true peace.",moves:["💥 Shinra Tensei","🌪️ Chibaku Tensei","☠️ Outer Path"]},{name:"Madara Uchiha",title:"Ghost of the Uchiha Clan",maxHp:800,img:"🌀",color:"#f97316",minXp:160,reward:220,quote:"Wake up to reality! Nothing ever goes as planned.",moves:["🔥 Susanoo","🌑 Meteor Drop","👁️ Infinite Tsukuyomi"]},{name:"Kaguya Otsutsuki",title:"Final Boss · Rabbit Goddess",maxHp:1500,img:"👁️",color:"#ec4899",minXp:200,reward:999,quote:"I am all chakra. I am the beginning and the end.",moves:["🌸 Ash Killing Bones","🌀 Dimension Shift","☄️ Expansive Truth"]}];
const JUTSUS=[{name:"Shadow Clone",dmg:15,chakraCost:5,color:"#f59e0b",icon:"👥",desc:"Kage Bunshin!"},{name:"Rasengan",dmg:30,chakraCost:10,color:"#60a5fa",icon:"🌀",desc:"Spiraling sphere!"},{name:"Fire Style",dmg:40,chakraCost:15,color:"#ef4444",icon:"🔥",desc:"Katon!"},{name:"Lightning Blade",dmg:55,chakraCost:20,color:"#a78bfa",icon:"⚡",desc:"1000 birds!"},{name:"Sage Mode",dmg:75,chakraCost:30,color:"#10b981",icon:"🐸",desc:"Nature energy!"},{name:"Kurama Mode",dmg:100,chakraCost:40,color:"#f97316",icon:"🦊",desc:"Nine-Tails!"}];
const EXAM_SUBJECTS=[{id:"maths",name:"Mathematics",icon:"📐",color:"#3b82f6"},{id:"physics",name:"Physics",icon:"⚛️",color:"#8b5cf6"},{id:"chem",name:"Chemistry",icon:"🧪",color:"#10b981"},{id:"cs",name:"Computer Science",icon:"💻",color:"#f59e0b"},{id:"english",name:"English",icon:"📜",color:"#ef4444"},{id:"other",name:"Other",icon:"📚",color:"#9ca3af"}];
const EXAM_XP={easy:15,medium:25,hard:40};
const EXAM_CHAKRA={easy:8,medium:15,hard:25};
const ACHIEVEMENTS=[{id:"first_blood",icon:"🩸",name:"First Mission",desc:"Complete your first task",check:s=>s.totalTasksDone>=1},{id:"perfect_day",icon:"🌟",name:"Perfect Day",desc:"Complete all tasks in a day",check:s=>s.perfectDays>=1},{id:"streak3",icon:"🔥",name:"On Fire",desc:"3-day streak",check:s=>s.maxStreak>=3},{id:"boss1",icon:"⚔️",name:"Villain Slayer",desc:"Defeat your first villain",check:s=>s.villainsDefeated>=1},{id:"boss5",icon:"👑",name:"Akatsuki's End",desc:"Defeat 5 villains",check:s=>s.villainsDefeated>=5},{id:"xp500",icon:"💥",name:"Chakra Master",desc:"Earn 500 total XP",check:s=>s.totalXp>=500},{id:"exam10",icon:"🎓",name:"Exam Warrior",desc:"Complete 10 exam tasks",check:s=>s.examDone>=10},{id:"hokage",icon:"🔴",name:"Hokage!",desc:"Reach Hokage rank",check:s=>s.maxRank>=5},{id:"combo5",icon:"🌪️",name:"Combo Master",desc:"Hit a 5x combo",check:s=>s.maxCombo>=5}];
const NARUTO_QUOTES=["Dattebayo! I'll never give up — that's my ninja way!","Hard work is worthless for those that don't believe in themselves.","I'm not gonna run away. I never go back on my word!","A genius? I worked hard. I studied. That's all.","When protecting something precious, you truly become stronger."];
const COMBO_MSGS=["NICE! 🌀","COMBO ×2! 🔥","ON FIRE! ⚡","UNSTOPPABLE! 💥","SAGE MODE! 🐸","KURAMA! 🦊","GOD-TIER! 👊"];

function todayKey(){const dt=new Date();return`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;}
function formatDate(k){const[y,mo,d]=k.split("-").map(Number);return new Date(y,mo-1,d,12).toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"short"});}
function getRank(xp){for(let i=RANKS.length-1;i>=0;i--)if(xp>=RANKS[i].min)return{...RANKS[i],index:i};return{...RANKS[0],index:0};}
function pctColor(p){if(p===100)return"#10b981";if(p>=70)return"#3b82f6";if(p>=40)return"#f59e0b";return"#ef4444";}
function loadS(k){try{const v=localStorage.getItem("nw_"+k);return v?JSON.parse(v):null;}catch{return null;}}
function saveS(k,v){try{localStorage.setItem("nw_"+k,JSON.stringify(v));}catch{}}
function useLiveTime(){const[now,setNow]=useState(new Date());useEffect(()=>{const id=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(id);},[]);return now;}
let _id=0;function uid(){return++_id;}

function Particles({bursts}){return(<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}}>{bursts.map(b=>[...Array(b.count||10)].map((_,i)=>{const angle=(i/(b.count||10))*Math.PI*2,dist=50+Math.random()*70;return<motion.div key={`${b.id}-${i}`} initial={{opacity:1,x:b.x,y:b.y,scale:1}} animate={{opacity:0,x:b.x+Math.cos(angle)*dist,y:b.y+Math.sin(angle)*dist,scale:0}} transition={{duration:.7+Math.random()*.3,ease:"easeOut"}} style={{position:"absolute",width:b.size||7,height:b.size||7,borderRadius:"50%",background:b.color||"#f59e0b",boxShadow:`0 0 8px ${b.color||"#f59e0b"}`,top:0,left:0}}/>;}))}  </div>);}
function FloatLabels({labels}){return(<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9998}}>{labels.map(l=><motion.div key={l.id} initial={{opacity:1,y:l.y,x:l.x,scale:.6}} animate={{opacity:0,y:l.y-80,scale:1.1}} transition={{duration:1.1,ease:"easeOut"}} style={{position:"absolute",fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:l.size||18,color:l.color||"#f59e0b",textShadow:`0 0 20px ${l.color||"#f59e0b"}`,whiteSpace:"nowrap"}}>{l.text}</motion.div>)}</div>);}
function ScreenFlash({flashes}){return(<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9990}}>{flashes.map(f=><motion.div key={f.id} initial={{opacity:f.opacity||.4}} animate={{opacity:0}} transition={{duration:f.dur||.4}} style={{position:"absolute",inset:0,background:f.color}}/>)}</div>);}

function LiveClock({now}){
  const h=now.getHours(),m=now.getMinutes(),s=now.getSeconds(),ampm=h>=12?"PM":"AM",h12=h%12||12;
  const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return(<div style={{textAlign:"center"}}><motion.div animate={{textShadow:["0 0 20px #f59e0b88","0 0 35px #f59e0bcc","0 0 20px #f59e0b88"]}} transition={{repeat:Infinity,duration:2}} style={{fontFamily:"'Orbitron',monospace",fontSize:30,fontWeight:900,color:"#f59e0b",letterSpacing:3,lineHeight:1}}>{String(h12).padStart(2,"0")}<motion.span animate={{opacity:[1,0,1]}} transition={{repeat:Infinity,duration:1}}>:</motion.span>{String(m).padStart(2,"0")}<span style={{fontSize:18,color:"#f97316"}}>:{String(s).padStart(2,"0")}</span><span style={{fontSize:12,color:"#f97316",marginLeft:5}}>{ampm}</span></motion.div><div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"#6b5a3e",marginTop:3,letterSpacing:2}}>{DAYS[now.getDay()].toUpperCase()}, {MONTHS[now.getMonth()]} {now.getDate()}, {now.getFullYear()}</div></div>);
}

function RankBar({xp,maxXp}){
  const pct=maxXp?Math.min((xp/maxXp)*100,100):0;
  const rank=getRank(xp),nextRank=RANKS[rank.index+1];
  return(<div><div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontFamily:"'Cinzel',serif",fontSize:10}}><span style={{color:rank.color,fontWeight:700}}>{rank.badge} {rank.name}</span><span style={{color:"#6b5a3e"}}>{xp}/{maxXp} XP</span></div><div style={{height:9,background:"#1a0a00",borderRadius:5,overflow:"hidden",border:`1px solid ${rank.color}33`,position:"relative"}}><motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:.8,ease:"easeOut"}} style={{height:"100%",background:`linear-gradient(90deg,${rank.color}77,${rank.color},#fff8)`,boxShadow:`0 0 14px ${rank.color}`}}/><motion.div animate={{x:["0%","300%"]}} transition={{repeat:Infinity,duration:2.5,ease:"linear"}} style={{position:"absolute",top:0,left:"-20%",width:"20%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)",pointerEvents:"none"}}/></div>{nextRank&&<div style={{fontSize:8,color:"#4b5563",fontFamily:"'Cinzel',serif",textAlign:"right",marginTop:3}}>Next: {nextRank.name} at {nextRank.min} XP</div>}</div>);
}

function TaskRow({t,i,onToggle,onRef}){
  const ref=useRef(null);
  useEffect(()=>{if(ref.current)onRef(i,ref.current);},[]);
  return(<motion.div ref={ref} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*.05}} onClick={()=>onToggle(i,ref.current)} whileHover={{x:4}} whileTap={{scale:.97}} style={{display:"flex",alignItems:"center",gap:9,padding:"11px 12px",marginBottom:7,borderRadius:10,cursor:"pointer",userSelect:"none",background:t.done?"linear-gradient(90deg,rgba(251,146,60,.12),rgba(239,68,68,.05))":"rgba(255,255,255,.03)",border:t.done?"1px solid rgba(251,146,60,.4)":"1px solid rgba(255,200,100,.07)",position:"relative",overflow:"hidden"}}>
    {t.done&&<motion.div animate={{x:["0%","300%"]}} transition={{repeat:Infinity,duration:3.5,ease:"linear"}} style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(251,146,60,.08),transparent)",pointerEvents:"none"}}/>}
    <span style={{fontSize:19,filter:t.done?"saturate(2) drop-shadow(0 0 6px #f97316)":"none"}}>{t.icon}</span>
    <div style={{flex:1}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:12,color:t.done?"#fb923c":"#e5c07b",textDecoration:t.done?"line-through":"none",opacity:t.done?.7:1}}>{t.task}</div><div style={{fontSize:9,color:"#6b5a3e",marginTop:1}}>{t.time}</div></div>
    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:1}}><span style={{fontSize:9,color:"#f59e0b",fontFamily:"'Cinzel',serif",fontWeight:700}}>+{t.xp}XP</span><span style={{fontSize:9,color:"#60a5fa"}}>+{t.chakra}💙</span></div>
    <motion.div animate={t.done?{scale:[1.3,1],rotate:[0,360]}:{}} transition={{duration:.4}} style={{width:24,height:24,borderRadius:"50%",background:t.done?"linear-gradient(135deg,#f97316,#ef4444)":"transparent",border:t.done?"2px solid #f97316":"2px solid #3d2e1a",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:t.done?"0 0 12px #f9731677":"none",flexShrink:0}}><span style={{color:t.done?"#fff":"#3d2e1a",fontSize:t.done?12:9,fontFamily:"'Cinzel',serif"}}>{t.done?"✓":i+1}</span></motion.div>
  </motion.div>);
}

function BossBattle({villain,playerChakra,villainHp,onJutsu,isDefeated,villainAttacking,playerShaking,lastMove}){
  const pct=Math.max(0,(villainHp/villain.maxHp)*100);
  const hpColor=pct>60?"#10b981":pct>30?"#f59e0b":"#ef4444";
  return(<div style={{background:`linear-gradient(135deg,${villain.color}18,#0d0500 70%)`,border:`1px solid ${villain.color}44`,borderRadius:14,overflow:"hidden",marginBottom:12}}>
    <div style={{padding:"16px 14px 12px",position:"relative",minHeight:130}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${villain.color}09 1px,transparent 1px)`,backgroundSize:"20px 20px"}}/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative"}}>
        <motion.div animate={playerShaking?{x:[-8,8,-8,8,0]}:{}} transition={{duration:.4}} style={{textAlign:"center",width:65}}>
          <motion.div animate={{y:[0,-5,0]}} transition={{repeat:Infinity,duration:2.2,ease:"easeInOut"}} style={{fontSize:38}}>🥷</motion.div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:8,color:"#10b981",letterSpacing:1,marginTop:2}}>YOU</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"#60a5fa",fontWeight:700}}>💙 {playerChakra}</div>
        </motion.div>
        <div style={{flex:1,textAlign:"center"}}>
          <motion.div animate={{scale:[1,1.1,1]}} transition={{repeat:Infinity,duration:1.5}} style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:18,color:"#ef4444",textShadow:"0 0 20px #ef4444"}}>VS</motion.div>
          {lastMove&&<motion.div initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:"'Cinzel',serif",fontSize:8,color:"#f59e0b",marginTop:3,lineHeight:1.4}}>{lastMove}</motion.div>}
        </div>
        <motion.div animate={villainAttacking?{x:[-10,0]}:{}} transition={{duration:.3}} style={{textAlign:"center",width:65}}>
          <motion.div animate={isDefeated?{scale:0,opacity:0}:{rotate:[-4,4,-4]}} transition={isDefeated?{duration:.5}:{repeat:Infinity,duration:2}} style={{fontSize:38}}>{isDefeated?"💀":villain.img}</motion.div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:8,color:villain.color,letterSpacing:.5,marginTop:2}}>{villain.name}</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"#ef4444",fontWeight:700}}>❤️ {villainHp}</div>
        </motion.div>
      </div>
      <div style={{marginTop:8}}><div style={{height:7,background:"#1a0505",borderRadius:4,overflow:"hidden",border:"1px solid #7f1d1d33"}}><motion.div animate={{width:`${pct}%`}} transition={{duration:.6,ease:"easeOut"}} style={{height:"100%",background:`linear-gradient(90deg,#7f1d1d,${hpColor})`,boxShadow:`0 0 10px ${hpColor}`}}/></div><div style={{display:"flex",justifyContent:"space-between",marginTop:2}}><span style={{fontSize:8,fontFamily:"'Cinzel',serif",color:"#6b5a3e"}}>{villain.title}</span><span style={{fontSize:8,fontFamily:"'Cinzel',serif",color:hpColor}}>{Math.round(pct)}%</span></div></div>
    </div>
    <div style={{padding:"6px 14px",borderTop:"1px solid rgba(255,200,100,.05)",background:"rgba(0,0,0,.2)"}}><span style={{fontFamily:"'Crimson Text',serif",fontStyle:"italic",fontSize:11,color:"#9ca3af"}}>"{villain.quote}"</span></div>
    {!isDefeated?(
      <div style={{padding:"10px 12px 12px"}}>
        <div style={{fontSize:8,fontFamily:"'Cinzel',serif",color:"#6b5a3e",letterSpacing:1.5,marginBottom:7}}>⚡ SELECT JUTSU — {playerChakra} Chakra Available</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5}}>
          {JUTSUS.map((j,i)=>{const can=j.chakraCost<=playerChakra;return(
            <motion.button key={i} onClick={()=>can&&onJutsu(j)} whileHover={can?{scale:1.05,y:-2}:{}} whileTap={can?{scale:.95}:{}} style={{padding:"7px 3px",borderRadius:7,border:`1px solid ${can?j.color+"55":"#333"}`,background:can?`linear-gradient(135deg,${j.color}22,${j.color}08)`:"rgba(0,0,0,.2)",cursor:can?"pointer":"not-allowed",opacity:can?1:.35}}>
              <div style={{fontSize:16}}>{j.icon}</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:7,color:can?j.color:"#4b5563",fontWeight:700,marginTop:2}}>{j.name}</div>
              <div style={{fontSize:7,color:"#6b5a3e",marginTop:1}}>💙{j.chakraCost}/⚔️{j.dmg}</div>
            </motion.button>
          );})}
        </div>
      </div>
    ):(
      <motion.div initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} style={{padding:"14px",textAlign:"center"}}>
        <div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:16,color:"#f59e0b",textShadow:"0 0 20px #f59e0b",marginBottom:3}}>⚔️ VICTORY! ⚔️</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"#10b981"}}>+{villain.reward} Bonus XP Earned!</div>
      </motion.div>
    )}
  </div>);
}

function ExamPanel({onAdd,addFx}){
  const[subject,setSubject]=useState(EXAM_SUBJECTS[0].id);
  const[topic,setTopic]=useState("");
  const[diff,setDiff]=useState("medium");
  const ref=useRef(null);
  function handleAdd(){
    if(!topic.trim())return;
    const sub=EXAM_SUBJECTS.find(s=>s.id===subject);
    addFx({xp:EXAM_XP[diff],chakra:EXAM_CHAKRA[diff],el:ref.current});
    onAdd({subject:sub,topic:topic.trim(),difficulty:diff,xp:EXAM_XP[diff],chakra:EXAM_CHAKRA[diff],done:true,time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})});
    setTopic("");
  }
  return(<div ref={ref} style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,200,100,.07)",borderRadius:12,padding:14,marginBottom:12}}>
    <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:12,color:"#f59e0b",marginBottom:10,letterSpacing:1}}>📋 LOG STUDY SESSION</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:7}}>
      <div><div style={{fontSize:8,color:"#6b5a3e",fontFamily:"'Cinzel',serif",letterSpacing:1,marginBottom:3}}>SUBJECT</div>
        <select value={subject} onChange={e=>setSubject(e.target.value)} style={{width:"100%",background:"#0d0500",border:"1px solid #3d2e1a",borderRadius:6,color:"#e5c07b",fontFamily:"'Cinzel',serif",fontSize:10,padding:"5px 7px",outline:"none"}}>
          {EXAM_SUBJECTS.map(s=><option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
        </select></div>
      <div><div style={{fontSize:8,color:"#6b5a3e",fontFamily:"'Cinzel',serif",letterSpacing:1,marginBottom:3}}>DIFFICULTY</div>
        <div style={{display:"flex",gap:3}}>
          {["easy","medium","hard"].map(d=>(
            <motion.button key={d} onClick={()=>setDiff(d)} whileTap={{scale:.9}} style={{flex:1,padding:"5px 2px",borderRadius:5,fontFamily:"'Cinzel',serif",fontSize:8,fontWeight:700,background:diff===d?(d==="easy"?"#10b981":d==="medium"?"#3b82f6":"#ef4444"):"transparent",border:`1px solid ${d==="easy"?"#10b981":d==="medium"?"#3b82f6":"#ef4444"}`,color:diff===d?"#fff":(d==="easy"?"#10b981":d==="medium"?"#3b82f6":"#ef4444"),cursor:"pointer",textTransform:"capitalize"}}>{d}</motion.button>
          ))}
        </div></div>
    </div>
    <div style={{marginBottom:7}}><div style={{fontSize:8,color:"#6b5a3e",fontFamily:"'Cinzel',serif",letterSpacing:1,marginBottom:3}}>TOPIC / CHAPTER</div>
      <input value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd()} placeholder="e.g. Integration by Parts..." style={{width:"100%",background:"#0d0500",border:"1px solid #3d2e1a",borderRadius:6,color:"#e5c07b",fontFamily:"'Cinzel',serif",fontSize:10,padding:"6px 9px",outline:"none",boxSizing:"border-box"}}/></div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:9,color:"#6b5a3e",fontFamily:"'Cinzel',serif"}}>+{EXAM_XP[diff]}XP / +{EXAM_CHAKRA[diff]}💙</span>
      <motion.button onClick={handleAdd} whileHover={{scale:1.05}} whileTap={{scale:.95}} style={{padding:"6px 14px",borderRadius:7,background:"linear-gradient(135deg,#f97316,#ef4444)",border:"none",color:"#fff",fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10,cursor:"pointer",boxShadow:"0 0 12px #f9731677"}}>✓ LOG MISSION</motion.button>
    </div>
  </div>);
}

function StatsPanel({stats,history}){
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:12}}>
      {[{label:"Total XP",val:stats.totalXp,icon:"⚡",color:"#f59e0b"},{label:"Tasks Done",val:stats.totalTasksDone,icon:"✅",color:"#10b981"},{label:"Perfect Days",val:stats.perfectDays,icon:"🌟",color:"#60a5fa"},{label:"Best Streak",val:`${stats.maxStreak}d`,icon:"🔥",color:"#ef4444"},{label:"Villains Slain",val:stats.villainsDefeated,icon:"⚔️",color:"#a78bfa"},{label:"Exams Logged",val:stats.examDone,icon:"🎓",color:"#f97316"}].map((s,i)=>(
        <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*.05}} style={{background:"rgba(255,255,255,.02)",border:`1px solid ${s.color}22`,borderRadius:10,padding:"9px 11px"}}>
          <div style={{fontSize:16,marginBottom:3}}>{s.icon}</div>
          <div style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:16,color:s.color}}>{s.val}</div>
          <div style={{fontSize:8,color:"#6b5a3e",fontFamily:"'Cinzel',serif",letterSpacing:.5,marginTop:2}}>{s.label}</div>
        </motion.div>
      ))}
    </div>
    <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11,color:"#f59e0b",marginBottom:7,letterSpacing:1}}>🏆 ACHIEVEMENTS</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginBottom:14}}>
      {ACHIEVEMENTS.map((a,i)=>{const earned=a.check(stats);return(
        <motion.div key={a.id} initial={{scale:0}} animate={{scale:1}} transition={{delay:i*.04,type:"spring"}} title={`${a.name}: ${a.desc}`} style={{textAlign:"center",padding:"7px 3px",borderRadius:7,background:earned?"rgba(245,158,11,.15)":"rgba(0,0,0,.2)",border:`1px solid ${earned?"#f59e0b44":"#1a1a1a"}`,filter:earned?"none":"grayscale(1) opacity(.3)"}}>
          <div style={{fontSize:20}}>{a.icon}</div>
          <div style={{fontSize:6,color:earned?"#f59e0b":"#4b5563",fontFamily:"'Cinzel',serif",marginTop:2,lineHeight:1.2}}>{a.name}</div>
        </motion.div>
      );})}
    </div>
    <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11,color:"#f59e0b",marginBottom:7,letterSpacing:1}}>📅 MISSION HISTORY</div>
    {Object.keys(history).sort((a,b)=>b.localeCompare(a)).slice(0,6).map(k=>{
      const day=history[k],done=day.filter(t=>t.done).length,total=day.length,pct=total?Math.round((done/total)*100):0;
      return(<div key={k} style={{display:"flex",alignItems:"center",gap:9,marginBottom:5,padding:"7px 10px",borderRadius:7,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,200,100,.05)"}}>
        <div style={{flex:1}}><div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"#e5c07b",fontWeight:700}}>{formatDate(k)}</div><div style={{fontSize:8,color:"#6b5a3e",marginTop:1}}>{done}/{total} missions</div></div>
        <div style={{textAlign:"right"}}><div style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:13,color:pctColor(pct)}}>{pct}%</div>{pct===100&&<div style={{fontSize:7,color:"#f59e0b"}}>⭐ PERFECT</div>}</div>
      </div>);
    })}
    {Object.keys(history).length===0&&<div style={{textAlign:"center",color:"#3d2e1a",fontFamily:"'Crimson Text',serif",fontStyle:"italic",fontSize:12,padding:"16px 0"}}>No history yet, Shinobi. Start your first mission!</div>}
  </div>);
}

export default function App(){
  const [user, setUser] = useState(null);

useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });
}, []);

async function signInWithGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: 'https://ninja-way.vercel.app' }
  });
}

async function signOut() {
  await supabase.auth.signOut();
}
  const now=useLiveTime();
  const[tab,setTab]=useState("missions");
  const[tasks,setTasks]=useState([]);
  const[currentDay,setCurrentDay]=useState(todayKey());
  const[chakra,setChakra]=useState(0);
  const[totalXp,setTotalXp]=useState(0);
  const[history,setHistory]=useState({});
  const[stats,setStats]=useState({totalXp:0,totalTasksDone:0,perfectDays:0,maxStreak:0,currentStreak:0,villainsDefeated:0,examDone:0,maxRank:0,maxCombo:0});
  const[combo,setCombo]=useState(0);
  const[comboTimer,setComboTimer]=useState(null);
  const[examLog,setExamLog]=useState([]);
  const[villainIdx,setVillainIdx]=useState(0);
  const[villainHp,setVillainHp]=useState(VILLAINS[0].maxHp);
  const[isDefeated,setIsDefeated]=useState(false);
  const[villainAttacking,setVillainAttacking]=useState(false);
  const[playerShaking,setPlayerShaking]=useState(false);
  const[lastMove,setLastMove]=useState("");
  const[bursts,setBursts]=useState([]);
  const[labels,setLabels]=useState([]);
  const[flashes,setFlashes]=useState([]);
  const[toast,setToast]=useState(null);
  const[quote]=useState(NARUTO_QUOTES[Math.floor(Math.random()*NARUTO_QUOTES.length)]);
  const taskRefs=useRef({});
  const[loaded,setLoaded]=useState(false);

  useEffect(()=>{
    const s=loadS("stats")||{totalXp:0,totalTasksDone:0,perfectDays:0,maxStreak:0,currentStreak:0,villainsDefeated:0,examDone:0,maxRank:0,maxCombo:0};
    const h=loadS("history")||{};
    const vIdx=loadS("vIdx")??0;
    const vHp=loadS("vHp");
    const ck=loadS("chakra")??0;
    const el=loadS("examlog")||[];
    const today=todayKey();
    const todayTasks=h[today]||DEFAULT_TASKS.map(t=>({...t,done:false}));
    setStats(s);setTotalXp(s.totalXp);setHistory(h);
    const safeIdx=Math.min(vIdx,VILLAINS.length-1);
    setVillainIdx(safeIdx);setVillainHp(vHp!==null?vHp:VILLAINS[safeIdx].maxHp);
    setChakra(ck);setExamLog(el);setTasks(todayTasks);setCurrentDay(today);setLoaded(true);
  },[]);

  useEffect(()=>{
    if(!loaded)return;
    saveS("stats",stats);saveS("history",history);saveS("vIdx",villainIdx);saveS("vHp",villainHp);saveS("chakra",chakra);saveS("examlog",examLog);
  },[stats,history,villainIdx,villainHp,chakra,examLog,loaded]);

  function addBurst(el,color,count=10,size=7){
    if(!el)return;
    const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,id=uid();
    setBursts(b=>[...b,{id,x,y,color,count,size}]);
    setTimeout(()=>setBursts(b=>b.filter(p=>p.id!==id)),1200);
  }
  function addLabel(el,text,color,size=18){
    if(!el)return;
    const r=el.getBoundingClientRect(),id=uid();
    setLabels(l=>[...l,{id,x:r.left+r.width/2-30,y:r.top,text,color,size}]);
    setTimeout(()=>setLabels(l=>l.filter(p=>p.id!==id)),1300);
  }
  function addFlash(color,opacity=.35,dur=.4){
    const id=uid();
    setFlashes(f=>[...f,{id,color,opacity,dur}]);
    setTimeout(()=>setFlashes(f=>f.filter(p=>p.id!==id)),600);
  }
  function showToast(msg,color="#f59e0b"){setToast({msg,color});setTimeout(()=>setToast(null),2800);}

  function bumpCombo(el){
    setCombo(c=>{
      const nc=c+1;
      if(nc>=2)addLabel(el,COMBO_MSGS[Math.min(nc-1,COMBO_MSGS.length-1)],"#f59e0b",14);
      setStats(s=>({...s,maxCombo:Math.max(s.maxCombo,nc)}));
      return nc;
    });
    if(comboTimer)clearTimeout(comboTimer);
    setComboTimer(setTimeout(()=>setCombo(0),4000));
  }

  function toggleTask(i,el){
    const t=tasks[i],wasNotDone=!t.done;
    const newTasks=tasks.map((task,idx)=>idx===i?{...task,done:!task.done}:task);
    setTasks(newTasks);
    setHistory(h=>({...h,[currentDay]:newTasks}));
    if(wasNotDone){
      setChakra(c=>c+t.chakra);setTotalXp(x=>x+t.xp);
      setStats(s=>{const nXp=s.totalXp+t.xp,rank=getRank(nXp);return{...s,totalXp:nXp,totalTasksDone:s.totalTasksDone+1,maxRank:Math.max(s.maxRank,rank.index)};});
      addBurst(el,"#f59e0b",12,8);addLabel(el,`+${t.xp} XP`,"#f59e0b",16);
      setTimeout(()=>addLabel(el,`+${t.chakra}💙`,"#60a5fa",13),300);
      addFlash("rgba(245,158,11,.2)");bumpCombo(el);
      const allDone=newTasks.every(t=>t.done);
      if(allDone){setTimeout(()=>{addFlash("rgba(16,185,129,.3)",.5,.7);showToast("🌟 PERFECT DAY! All missions complete!","#10b981");setStats(s=>{const ns=s.currentStreak+1;return{...s,perfectDays:s.perfectDays+1,currentStreak:ns,maxStreak:Math.max(s.maxStreak,ns)};});},400);}
    }else{
      setChakra(c=>Math.max(0,c-t.chakra));setTotalXp(x=>Math.max(0,x-t.xp));
      setStats(s=>({...s,totalXp:Math.max(0,s.totalXp-t.xp),totalTasksDone:Math.max(0,s.totalTasksDone-1)}));
    }
  }

  function addExam(entry){
    setExamLog(l=>[entry,...l].slice(0,50));
    setChakra(c=>c+entry.chakra);setTotalXp(x=>x+entry.xp);
    setStats(s=>({...s,totalXp:s.totalXp+entry.xp,examDone:s.examDone+1,maxRank:Math.max(s.maxRank,getRank(s.totalXp+entry.xp).index)}));
  }
  function addExamFx({xp,chakra:ck,el}){
    addBurst(el,"#3b82f6",10);addLabel(el,`+${xp} XP`,"#f59e0b",15);
    setTimeout(()=>addLabel(el,`+${ck}💙`,"#60a5fa",12),300);
    addFlash("rgba(59,130,246,.2)");showToast(`🎓 Study session logged! +${xp}XP`,"#3b82f6");
  }

  function handleJutsu(jutsu){
    if(isDefeated)return;
    const villain=VILLAINS[villainIdx];
    const dmgDealt=jutsu.dmg+Math.floor(Math.random()*10);
    const newHp=Math.max(0,villainHp-dmgDealt);
    setChakra(c=>Math.max(0,c-jutsu.chakraCost));setVillainHp(newHp);
    setLastMove(`${jutsu.icon} ${jutsu.name} — ${dmgDealt} dmg!`);
    addFlash(`${villain.color}33`,.4,.3);
    if(newHp<=0){
      setIsDefeated(true);addFlash("rgba(245,158,11,.5)",.6,.8);
      showToast(`🏆 ${villain.name} DEFEATED! +${villain.reward} Bonus XP!`,"#f59e0b");
      setTotalXp(x=>x+villain.reward);
      setStats(s=>({...s,totalXp:s.totalXp+villain.reward,villainsDefeated:s.villainsDefeated+1}));
      setTimeout(()=>{const nIdx=Math.min(villainIdx+1,VILLAINS.length-1);setVillainIdx(nIdx);setVillainHp(VILLAINS[nIdx].maxHp);setIsDefeated(false);setLastMove("");},3500);
      return;
    }
    setTimeout(()=>{
      const move=villain.moves[Math.floor(Math.random()*villain.moves.length)];
      const dmgTaken=5+Math.floor(Math.random()*12);
      setVillainAttacking(true);setPlayerShaking(true);
      setLastMove(`${villain.name}: ${move}! −${dmgTaken} Chakra`);
      setChakra(c=>Math.max(0,c-dmgTaken));addFlash("rgba(239,68,68,.2)",.3,.3);
      setTimeout(()=>{setVillainAttacking(false);setPlayerShaking(false);},500);
    },600);
  }

  const villain=VILLAINS[villainIdx];
  const rank=getRank(totalXp);
  const nextRank=RANKS[rank.index+1];
  const maxXp=nextRank?nextRank.min:RANKS[RANKS.length-1].min;
  const donePct=tasks.length?Math.round((tasks.filter(t=>t.done).length/tasks.length)*100):0;
  const TABS=[{id:"missions",icon:"🗡️",label:"MISSIONS"},{id:"battle",icon:"⚔️",label:"BATTLE"},{id:"exam",icon:"📋",label:"STUDY"},{id:"stats",icon:"📊",label:"STATS"}];

  if(!loaded)return(<div style={{minHeight:"100vh",background:"#0d0500",display:"flex",alignItems:"center",justifyContent:"center"}}><motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1,ease:"linear"}} style={{fontSize:48}}>🌀</motion.div></div>);

  return(
    <div style={{minHeight:"100vh",background:"#0d0500",color:"#e5c07b",fontFamily:"'Cinzel',serif",backgroundImage:"radial-gradient(ellipse at 50% 0%, rgba(245,158,11,.06) 0%, transparent 60%)",paddingBottom:72}}>
      <Particles bursts={bursts}/><FloatLabels labels={labels}/><ScreenFlash flashes={flashes}/>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Orbitron:wght@400;700;900&family=Crimson+Text:ital@0;1&display=swap');*{box-sizing:border-box;}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:#0d0500;}::-webkit-scrollbar-thumb{background:#3d2e1a;border-radius:2px;}button,select,input{font-family:'Cinzel',serif;}input::placeholder{color:#3d2e1a;}`}</style>

      <AnimatePresence>{toast&&<motion.div initial={{opacity:0,y:-40}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-40}} style={{position:"fixed",top:14,left:"50%",transform:"translateX(-50%)",zIndex:10000,background:"#0d0500",border:`1px solid ${toast.color}`,borderRadius:9,padding:"9px 18px",fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11,color:toast.color,boxShadow:`0 0 22px ${toast.color}55`,whiteSpace:"nowrap",maxWidth:"90vw",textAlign:"center"}}>{toast.msg}</motion.div>}</AnimatePresence>

      <div style={{padding:"18px 14px 0",maxWidth:460,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:14}}>
          <motion.div animate={{opacity:[.7,1,.7]}} transition={{repeat:Infinity,duration:3}} style={{fontSize:8,letterSpacing:4,color:"#6b5a3e",marginBottom:5}}>{!user ? (
  <motion.button onClick={signInWithGoogle}
    whileHover={{scale:1.05}} whileTap={{scale:.95}}
    style={{width:"100%",padding:"10px",marginBottom:12,borderRadius:10,
      background:"linear-gradient(135deg,#f97316,#ef4444)",border:"none",
      color:"#fff",fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:12,
      cursor:"pointer",boxShadow:"0 0 14px #f9731677"}}>
    🔑 Sign in with Google to Save Progress
  </motion.button>
) : (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
    marginBottom:12,padding:"8px 12px",borderRadius:10,
    background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,200,100,.07)"}}>
    <span style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"#f59e0b"}}>
      👤 {user.email}
    </span>
    <motion.button onClick={signOut} whileTap={{scale:.95}}
      style={{padding:"4px 10px",borderRadius:6,background:"transparent",
        border:"1px solid #ef4444",color:"#ef4444",fontFamily:"'Cinzel',serif",
        fontSize:9,cursor:"pointer"}}>
      Sign Out
    </motion.button>
  </div>
)}⬥ HIDDEN LEAF VILLAGE ⬥</motion.div>
          <div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:20,background:"linear-gradient(135deg,#f59e0b,#f97316,#ef4444)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:2,lineHeight:1}}>NINJA WAY</div>
          <div style={{fontSize:8,color:"#4b5563",letterSpacing:3,marginTop:2}}>DAILY MISSION TRACKER</div>
        </div>

        <div style={{marginBottom:12}}><LiveClock now={now}/></div>

        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{background:"rgba(255,255,255,.02)",border:`1px solid ${rank.color}33`,borderRadius:13,padding:"13px 14px",marginBottom:10,boxShadow:`0 0 28px ${rank.color}11`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
            <div><div style={{fontSize:8,color:"#6b5a3e",letterSpacing:1.5}}>CURRENT RANK</div><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:15,color:rank.color,textShadow:`0 0 14px ${rank.color}99`}}>{rank.badge} {rank.name}</div><div style={{fontSize:8,color:"#4b5563",marginTop:1}}>{rank.title}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:20,color:"#f59e0b",textShadow:"0 0 14px #f59e0b88"}}>{totalXp}</div><div style={{fontSize:8,color:"#6b5a3e",letterSpacing:1}}>TOTAL XP</div>{combo>=2&&<motion.div animate={{scale:[1,1.15,1]}} transition={{repeat:Infinity,duration:.6}} style={{fontSize:9,color:"#ef4444",fontWeight:700,marginTop:2}}>{COMBO_MSGS[Math.min(combo-1,COMBO_MSGS.length-1)]}</motion.div>}</div>
          </div>
          <RankBar xp={totalXp} maxXp={maxXp}/>
        </motion.div>

        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.15}} style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,200,100,.07)",borderRadius:9,padding:"9px 13px",marginBottom:14,display:"flex",alignItems:"center",gap:11}}>
          <div style={{flex:1}}><div style={{fontSize:8,color:"#6b5a3e",letterSpacing:1.5,marginBottom:4}}>TODAY'S PROGRESS</div><div style={{height:5,background:"#1a0a00",borderRadius:3,overflow:"hidden"}}><motion.div animate={{width:`${donePct}%`}} transition={{duration:.6}} style={{height:"100%",background:"linear-gradient(90deg,#f97316,#ef4444)",boxShadow:"0 0 8px #f97316"}}/></div></div>
          <div style={{textAlign:"center",flexShrink:0}}><div style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:18,color:pctColor(donePct)}}>{donePct}%</div><div style={{fontSize:7,color:"#6b5a3e"}}>{tasks.filter(t=>t.done).length}/{tasks.length}</div></div>
          <div style={{textAlign:"center",flexShrink:0}}><div style={{fontSize:16}}>💙</div><div style={{fontFamily:"'Orbitron',monospace",fontWeight:700,fontSize:13,color:"#60a5fa"}}>{chakra}</div><div style={{fontSize:7,color:"#6b5a3e"}}>CHAKRA</div></div>
        </motion.div>

        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.25}} style={{textAlign:"center",marginBottom:18,padding:"0 6px"}}><span style={{fontFamily:"'Crimson Text',serif",fontStyle:"italic",fontSize:12,color:"#6b5a3e",lineHeight:1.5}}>"{quote}"</span></motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.18}}>
            {tab==="missions"&&(<div><div style={{fontSize:8,color:"#6b5a3e",letterSpacing:2,marginBottom:9}}>⬥ DAILY MISSIONS — {formatDate(currentDay).toUpperCase()}</div>{tasks.map((t,i)=><TaskRow key={t.id} t={t} i={i} onToggle={toggleTask} onRef={(idx,el)=>{taskRefs.current[idx]=el;}}/>)}</div>)}
            {tab==="battle"&&(<div>
              <div style={{fontSize:8,color:"#6b5a3e",letterSpacing:2,marginBottom:9}}>⬥ BOSS BATTLE — USE CHAKRA TO FIGHT</div>
              <BossBattle villain={villain} playerChakra={chakra} villainHp={villainHp} onJutsu={handleJutsu} isDefeated={isDefeated} villainAttacking={villainAttacking} playerShaking={playerShaking} lastMove={lastMove}/>
              <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10,color:"#6b5a3e",letterSpacing:1,marginBottom:7,marginTop:3}}>VILLAIN ROSTER</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:4}}>
                {VILLAINS.map((v,i)=>{const unlocked=totalXp>=v.minXp,active=i===villainIdx;return(<div key={i} title={unlocked?v.name:`Unlock at ${v.minXp}XP`} style={{textAlign:"center",padding:"5px 2px",borderRadius:6,background:active?`${v.color}22`:"rgba(0,0,0,.2)",border:`1px solid ${active?v.color+"88":"#1a1a1a"}`,filter:unlocked?"none":"grayscale(1) opacity(.25)"}}><div style={{fontSize:18}}>{v.img}</div><div style={{fontSize:5,color:active?v.color:"#4b5563",fontFamily:"'Cinzel',serif",marginTop:1,lineHeight:1.2}}>{v.name.split(" ")[0]}</div></div>);})}
              </div>
            </div>)}
            {tab==="exam"&&(<div>
              <div style={{fontSize:8,color:"#6b5a3e",letterSpacing:2,marginBottom:9}}>⬥ STUDY MISSIONS — LOG YOUR SESSIONS</div>
              <ExamPanel onAdd={addExam} addFx={addExamFx}/>
              <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10,color:"#6b5a3e",letterSpacing:1,marginBottom:7}}>RECENT STUDY LOG</div>
              {examLog.length===0&&<div style={{textAlign:"center",color:"#3d2e1a",fontFamily:"'Crimson Text',serif",fontStyle:"italic",fontSize:12,padding:"16px 0"}}>No study sessions yet, Shinobi.</div>}
              {examLog.slice(0,8).map((e,i)=><motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*.04}} style={{display:"flex",alignItems:"center",gap:9,marginBottom:5,padding:"7px 11px",borderRadius:7,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,200,100,.05)"}}><span style={{fontSize:17}}>{e.subject.icon}</span><div style={{flex:1}}><div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"#e5c07b",fontWeight:700}}>{e.topic}</div><div style={{fontSize:8,color:"#6b5a3e",marginTop:1}}>{e.subject.name} · {e.difficulty} · {e.time}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:9,color:"#f59e0b",fontFamily:"'Cinzel',serif",fontWeight:700}}>+{e.xp}XP</div><div style={{fontSize:8,color:"#60a5fa"}}>+{e.chakra}💙</div></div></motion.div>)}
            </div>)}
            {tab==="stats"&&(<div><div style={{fontSize:8,color:"#6b5a3e",letterSpacing:2,marginBottom:9}}>⬥ SHINOBI RECORDS</div><StatsPanel stats={stats} history={history}/></div>)}
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(13,5,0,.96)",borderTop:"1px solid rgba(255,200,100,.1)",backdropFilter:"blur(12px)",zIndex:1000,padding:"7px 0 8px"}}>
        <div style={{display:"flex",maxWidth:460,margin:"0 auto"}}>
          {TABS.map(t=>(
            <motion.button key={t.id} onClick={()=>setTab(t.id)} whileTap={{scale:.9}} style={{flex:1,padding:"7px 4px",background:"transparent",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,outline:"none"}}>
              <motion.div animate={tab===t.id?{scale:[1,1.2,1]}:{}} transition={{duration:.3}} style={{fontSize:19,filter:tab===t.id?"drop-shadow(0 0 8px #f59e0b)":"none"}}>{t.icon}</motion.div>
              <span style={{fontFamily:"'Cinzel',serif",fontSize:7,fontWeight:700,letterSpacing:1.5,color:tab===t.id?"#f59e0b":"#3d2e1a",transition:"color .2s"}}>{t.label}</span>
              {tab===t.id&&<motion.div layoutId="tab-ind" style={{width:18,height:2,borderRadius:1,background:"#f59e0b",boxShadow:"0 0 8px #f59e0b"}}/>}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

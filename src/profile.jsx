import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function Profile({ totalXp, rank, tasksCompleted, streak }) {
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    supabase.auth.getUser().then(({ data }) => setUser(data?.user));
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || user?.email || "Ninja";
  const email = user?.email || "";

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0a0f,#1a0a00,#0a0a0f)",fontFamily:"'Cinzel',serif",color:"#f5e6c8",padding:"40px 20px 100px"}}>
      <div style={{maxWidth:500,margin:"0 auto",opacity:visible?1:0,transition:"all 0.8s ease"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:12,letterSpacing:5,color:"#e07b20",marginBottom:8}}>🍃 SHINOBI PROFILE</div>
          <h1 style={{fontSize:32,fontWeight:900,margin:0,background:"linear-gradient(135deg,#ff6b00,#ffd700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>NINJA DOSSIER</h1>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(224,123,32,0.3)",borderRadius:20,padding:"28px 24px",marginBottom:20,textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",margin:"0 auto 16px",border:"3px solid #e07b20",overflow:"hidden",background:"rgba(224,123,32,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>
            {avatarUrl?<img src={avatarUrl} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"🥷"}
          </div>
          <div style={{fontSize:20,fontWeight:800,color:"#ffd700",marginBottom:4}}>{fullName}</div>
          <div style={{fontSize:12,color:"#6a5a40",letterSpacing:1,marginBottom:16}}>{email}</div>
          <div style={{display:"inline-block",background:"rgba(224,123,32,0.15)",border:"1px solid rgba(224,123,32,0.4)",borderRadius:20,padding:"6px 20px",fontSize:12,letterSpacing:2,color:"#e07b20"}}>{rank||"GENIN"} 🔥</div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(224,123,32,0.2)",borderRadius:20,padding:"24px",marginBottom:20}}>
          <div style={{fontSize:11,letterSpacing:4,color:"#e07b20",marginBottom:20}}>⚡ MISSION STATS</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {[{label:"TOTAL XP",value:totalXp||0,icon:"⚡"},{label:"TASKS DONE",value:tasksCompleted||0,icon:"✅"},{label:"BEST STREAK",value:`${streak||0}d`,icon:"🔥"},{label:"CURRENT RANK",value:rank||"GENIN",icon:"🥷"}].map((s,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(224,123,32,0.1)",borderRadius:12,padding:"16px 12px",textAlign:"center"}}>
                <div style={{fontSize:24,marginBottom:8}}>{s.icon}</div>
                <div style={{fontSize:18,fontWeight:800,color:"#ffd700",marginBottom:4}}>{s.value}</div>
                <div style={{fontSize:9,letterSpacing:2,color:"#6a5a40"}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(224,123,32,0.2)",borderRadius:20,padding:"24px",marginBottom:20}}>
          <div style={{fontSize:11,letterSpacing:4,color:"#e07b20",marginBottom:16}}>⚙️ SETTINGS</div>
          {[{icon:"🌙",label:"Dark Mode",value:"Always On"},{icon:"🔔",label:"Notifications",value:"Enabled"},{icon:"🍃",label:"Theme",value:"Naruto"},{icon:"📧",label:"Account",value:email}].map((s,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<3?"1px solid rgba(224,123,32,0.1)":"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:18}}>{s.icon}</span>
                <span style={{fontSize:13,color:"#c4b49a"}}>{s.label}</span>
              </div>
              <span style={{fontSize:11,color:"#6a5a40",letterSpacing:1}}>{s.value}</span>
            </div>
          ))}
        </div>
        <button onClick={handleSignOut} style={{width:"100%",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",color:"#ef4444",padding:"16px",borderRadius:12,cursor:"pointer",fontSize:13,letterSpacing:3,fontFamily:"'Cinzel',serif",fontWeight:700}}>
          🚪 SIGN OUT
        </button>
        <div style={{textAlign:"center",marginTop:32,color:"#4a3f30",fontSize:11,letterSpacing:2}}>BELIEVE IT. BUILD IT. BECOME IT.</div>
      </div>
    </div>
  );
}

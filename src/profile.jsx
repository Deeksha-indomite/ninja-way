import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks";
import { readLocal } from "./lib/progressStore";
import { getRank } from "./lib/ranks";
import { deleteAccount } from "./lib/account";

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  // Read the live local cache once (App keeps it in sync with cloud + gameplay).
  const [p] = useState(() => readLocal());
  const stats = p.stats || {};
  const rank = getRank(stats.totalXp || 0);

  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || user?.email || "Ninja";
  const email = user?.email || "Not signed in";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleDelete = async () => {
    if (!user) return;
    const sure = window.confirm(
      "Delete your account and ALL progress? This cannot be undone."
    );
    if (!sure) return;
    setBusy(true);
    try {
      const res = await deleteAccount();
      if (res.ok && !res.authDeleted) {
        alert(
          "Your data was deleted and you've been signed out. Full account removal isn't enabled yet — email deekshastalwart07@gmail.com to complete it."
        );
      }
    } finally {
      setBusy(false);
      navigate("/");
    }
  };

  const stat = (label, value, icon) => ({ label, value, icon });
  const statCards = [
    stat("TOTAL XP", stats.totalXp || 0, "⚡"),
    stat("TASKS DONE", stats.totalTasksDone || 0, "✅"),
    stat("BEST STREAK", `${stats.maxStreak || 0}d`, "🔥"),
    stat("VILLAINS SLAIN", stats.villainsDefeated || 0, "⚔️"),
  ];

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0a0f,#1a0a00,#0a0a0f)",fontFamily:"'Cinzel',serif",color:"#f5e6c8",padding:"20px 20px 100px"}}>
      <div style={{maxWidth:500,margin:"0 auto"}}>
        <button onClick={()=>navigate("/")} style={{background:"transparent",border:"1px solid rgba(224,123,32,0.3)",color:"#e07b20",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:12,letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:20}}>
          ← BACK TO APP
        </button>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:12,letterSpacing:5,color:"#e07b20",marginBottom:8}}>🍃 SHINOBI PROFILE</div>
          <h1 style={{fontSize:32,fontWeight:900,margin:0,background:"linear-gradient(135deg,#ff6b00,#ffd700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>NINJA DOSSIER</h1>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(224,123,32,0.3)",borderRadius:20,padding:"28px 24px",marginBottom:20,textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",margin:"0 auto 16px",border:"3px solid #e07b20",overflow:"hidden",background:"rgba(224,123,32,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>
            {avatarUrl?<img src={avatarUrl} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"🥷"}
          </div>
          <div style={{fontSize:20,fontWeight:800,color:"#ffd700",marginBottom:4}}>{fullName}</div>
          <div style={{fontSize:12,color:"#6a5a40",letterSpacing:1,marginBottom:16}}>{email}</div>
          <div style={{display:"inline-block",background:"rgba(224,123,32,0.15)",border:"1px solid rgba(224,123,32,0.4)",borderRadius:20,padding:"6px 20px",fontSize:12,letterSpacing:2,color:"#e07b20"}}>{rank.badge} {rank.name}</div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(224,123,32,0.2)",borderRadius:20,padding:"24px",marginBottom:20}}>
          <div style={{fontSize:11,letterSpacing:4,color:"#e07b20",marginBottom:20}}>⚡ MISSION STATS</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {statCards.map((s,i)=>(
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
          {[{icon:"🍃",label:"Theme",value:"Naruto"},{icon:"📧",label:"Account",value:email},{icon:"🔒",label:"Privacy Policy",value:"View →",onClick:()=>navigate("/privacy")}].map((s,i)=>(
            <div key={i} onClick={s.onClick} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<2?"1px solid rgba(224,123,32,0.1)":"none",cursor:s.onClick?"pointer":"default"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:18}}>{s.icon}</span>
                <span style={{fontSize:13,color:"#c4b49a"}}>{s.label}</span>
              </div>
              <span style={{fontSize:11,color:"#6a5a40",letterSpacing:1,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.value}</span>
            </div>
          ))}
        </div>
        {user ? (
          <>
            <button onClick={handleSignOut} disabled={busy} style={{width:"100%",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",color:"#ef4444",padding:"16px",borderRadius:12,cursor:"pointer",fontSize:13,letterSpacing:3,fontFamily:"'Cinzel',serif",fontWeight:700,marginBottom:12}}>
              🚪 SIGN OUT
            </button>
            <button onClick={handleDelete} disabled={busy} style={{width:"100%",background:"transparent",border:"1px solid rgba(239,68,68,0.4)",color:"#b91c1c",padding:"14px",borderRadius:12,cursor:busy?"wait":"pointer",fontSize:12,letterSpacing:2,fontFamily:"'Cinzel',serif",fontWeight:700}}>
              {busy ? "DELETING…" : "🗑️ DELETE ACCOUNT & DATA"}
            </button>
          </>
        ) : (
          <button onClick={()=>navigate("/")} style={{width:"100%",background:"linear-gradient(135deg,#e07b20,#ffd700)",border:"none",color:"#0a0a0f",padding:"16px",borderRadius:12,cursor:"pointer",fontSize:13,letterSpacing:3,fontFamily:"'Cinzel',serif",fontWeight:700}}>
            🔑 SIGN IN FROM HOME
          </button>
        )}
        <div style={{textAlign:"center",marginTop:32,color:"#4a3f30",fontSize:11,letterSpacing:2}}>BELIEVE IT. BUILD IT. BECOME IT.</div>
      </div>
    </div>
  );
}

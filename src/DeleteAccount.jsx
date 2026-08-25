import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks";
import { deleteAccount } from "./lib/account";

const EMAIL = "deekshastalwart07@gmail.com";

export default function DeleteAccount() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null); // null | 'full' | 'partial'

  const card = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(224,123,32,0.2)",
    borderRadius: 16,
    padding: "28px 24px",
    marginBottom: 20,
  };
  const h2 = { fontSize: 13, letterSpacing: 3, color: "#e07b20", textTransform: "uppercase", marginTop: 0, marginBottom: 14 };
  const p = { fontSize: 14, lineHeight: 1.8, color: "#c4b49a", margin: "0 0 12px", fontFamily: "'Georgia', serif" };

  const handleDelete = async () => {
    const sure = window.confirm("Delete your account and ALL progress? This cannot be undone.");
    if (!sure) return;
    setBusy(true);
    try {
      const res = await deleteAccount();
      setDone(res.authDeleted ? "full" : "partial");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0a0f,#1a0a00,#0a0a0f)",fontFamily:"'Cinzel',serif",color:"#f5e6c8",padding:"20px 20px 80px"}}>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <button onClick={()=>navigate("/")} style={{background:"transparent",border:"1px solid rgba(224,123,32,0.3)",color:"#e07b20",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:12,letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:24}}>← BACK TO APP</button>

        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:12,letterSpacing:5,color:"#e07b20",marginBottom:10}}>🍃 ACCOUNT</div>
          <h1 style={{fontSize:"clamp(24px,6vw,38px)",fontWeight:900,margin:0,background:"linear-gradient(135deg,#ff6b00,#ffd700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>DELETE ACCOUNT &amp; DATA</h1>
        </div>

        {done ? (
          <div style={card}>
            <h2 style={h2}>✓ Done</h2>
            <p style={p}>
              {done === "full"
                ? "Your account and all associated data have been permanently deleted."
                : `Your progress data was deleted and you've been signed out. To fully remove your login record, email ${EMAIL} and we'll complete it.`}
            </p>
            <button onClick={()=>navigate("/")} style={{width:"100%",background:"linear-gradient(135deg,#e07b20,#ffd700)",border:"none",color:"#0a0a0f",padding:"14px",borderRadius:10,cursor:"pointer",fontSize:12,letterSpacing:2,fontFamily:"'Cinzel',serif",fontWeight:700,marginTop:8}}>RETURN HOME</button>
          </div>
        ) : (
          <>
            <div style={card}>
              <h2 style={h2}>🗑️ What Gets Deleted</h2>
              <p style={p}>Deleting your account permanently removes your progress (tasks, XP, streaks, study logs, battle progress) from our cloud database and this device, and removes your login record. This action <strong style={{color:"#ffd700"}}>cannot be undone</strong>.</p>
            </div>

            <div style={card}>
              <h2 style={h2}>⚡ Delete Now</h2>
              {user ? (
                <>
                  <p style={p}>Signed in as <strong style={{color:"#ffd700"}}>{user.email}</strong>.</p>
                  <button onClick={handleDelete} disabled={busy} style={{width:"100%",background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.5)",color:"#ef4444",padding:"16px",borderRadius:12,cursor:busy?"wait":"pointer",fontSize:13,letterSpacing:2,fontFamily:"'Cinzel',serif",fontWeight:700}}>
                    {busy ? "DELETING…" : "🗑️ PERMANENTLY DELETE MY ACCOUNT"}
                  </button>
                </>
              ) : (
                <>
                  <p style={p}>Sign in with the account you want to delete, then return here.</p>
                  <button onClick={()=>signInWithGoogle()} style={{width:"100%",background:"linear-gradient(135deg,#f97316,#ef4444)",border:"none",color:"#fff",padding:"14px",borderRadius:12,cursor:"pointer",fontSize:12,letterSpacing:2,fontFamily:"'Cinzel',serif",fontWeight:700}}>🔑 SIGN IN WITH GOOGLE</button>
                </>
              )}
            </div>

            <div style={card}>
              <h2 style={h2}>✉️ Prefer Email?</h2>
              <p style={p}>You can also request deletion by emailing <a href={`mailto:${EMAIL}?subject=Delete%20my%20Ninja%20Way%20account`} style={{color:"#e07b20"}}>{EMAIL}</a> from your account's email address. We'll process it within 30 days.</p>
            </div>
          </>
        )}

        <div style={{textAlign:"center",marginTop:24,color:"#4a3f30",fontSize:11,letterSpacing:2}}>BELIEVE IT. BUILD IT. BECOME IT.</div>
      </div>
    </div>
  );
}

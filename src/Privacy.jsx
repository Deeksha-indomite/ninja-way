import { useNavigate } from "react-router-dom";

const UPDATED = "August 2026";
const EMAIL = "deekshastalwart07@gmail.com";

export default function Privacy() {
  const navigate = useNavigate();
  const card = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(224,123,32,0.2)",
    borderRadius: 16,
    padding: "28px 24px",
    marginBottom: 20,
  };
  const h2 = { fontSize: 13, letterSpacing: 3, color: "#e07b20", textTransform: "uppercase", marginTop: 0, marginBottom: 14 };
  const p = { fontSize: 14, lineHeight: 1.8, color: "#c4b49a", margin: "0 0 12px", fontFamily: "'Georgia', serif" };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0a0f,#1a0a00,#0a0a0f)",fontFamily:"'Cinzel',serif",color:"#f5e6c8",padding:"20px 20px 80px"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <button onClick={()=>navigate("/")} style={{background:"transparent",border:"1px solid rgba(224,123,32,0.3)",color:"#e07b20",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:12,letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:24}}>← BACK TO APP</button>

        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:12,letterSpacing:5,color:"#e07b20",marginBottom:10}}>🍃 HIDDEN LEAF VILLAGE</div>
          <h1 style={{fontSize:"clamp(26px,6vw,40px)",fontWeight:900,margin:0,background:"linear-gradient(135deg,#ff6b00,#ffd700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>PRIVACY POLICY</h1>
          <div style={{fontSize:11,color:"#6a5a40",letterSpacing:2,marginTop:8}}>LAST UPDATED · {UPDATED.toUpperCase()}</div>
        </div>

        <div style={card}>
          <h2 style={h2}>📜 Overview</h2>
          <p style={p}>Ninja Way ("the app") is a gamified daily habit and study tracker. This policy explains what data we collect, how it's used, and how you can delete it. By using the app you agree to this policy.</p>
        </div>

        <div style={card}>
          <h2 style={h2}>🗂️ What We Collect</h2>
          <p style={p}><strong style={{color:"#ffd700"}}>Account info:</strong> if you sign in with Google, we receive your email address, name, and avatar image from Google. We do not receive your Google password.</p>
          <p style={p}><strong style={{color:"#ffd700"}}>Progress data:</strong> your in-app activity — completed tasks, XP, streaks, study logs, and battle progress.</p>
          <p style={p}><strong style={{color:"#ffd700"}}>We do NOT collect:</strong> location, contacts, photos, or any sensitive personal data.</p>
        </div>

        <div style={card}>
          <h2 style={h2}>🔐 How It's Stored & Used</h2>
          <p style={p}>Your progress is stored locally on your device and, when you're signed in, synced to <strong style={{color:"#ffd700"}}>Supabase</strong> (our cloud database provider) so it's available across devices. Data is protected by row-level security so only you can read or write your own records.</p>
          <p style={p}>We use your data solely to run the app and sync your progress. We do not sell your data.</p>
        </div>

        <div style={card}>
          <h2 style={h2}>📢 Advertising</h2>
          <p style={p}>The app may display ads via Google AdSense. Google may use cookies or device identifiers to serve ads. See <span style={{color:"#e07b20"}}>policies.google.com/technologies/ads</span> for details.</p>
        </div>

        <div style={card}>
          <h2 style={h2}>🗑️ Deleting Your Data</h2>
          <p style={p}>You can delete your account and all associated data at any time from <strong style={{color:"#ffd700"}}>Profile → Delete Account &amp; Data</strong>, or by visiting the <span onClick={()=>navigate("/delete-account")} style={{color:"#e07b20",cursor:"pointer",textDecoration:"underline"}}>account deletion page</span>. You may also email us to request deletion.</p>
        </div>

        <div style={card}>
          <h2 style={h2}>✉️ Contact</h2>
          <p style={p}>Questions about this policy? Email <a href={`mailto:${EMAIL}`} style={{color:"#e07b20"}}>{EMAIL}</a>.</p>
        </div>

        <div style={{textAlign:"center",marginTop:24,color:"#4a3f30",fontSize:11,letterSpacing:2}}>BELIEVE IT. BUILD IT. BECOME IT.</div>
      </div>
    </div>
  );
}

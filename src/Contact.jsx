import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("deekshastalwart07@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0a0f,#1a0a00,#0a0a0f)",fontFamily:"'Cinzel',serif",color:"#f5e6c8",padding:"40px 20px"}}>
      <div style={{maxWidth:600,margin:"0 auto",opacity:visible?1:0,transition:"all 0.8s ease"}}>
        <button onClick={()=>navigate("/")} style={{background:"transparent",border:"1px solid rgba(224,123,32,0.3)",color:"#e07b20",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:12,letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:24}}>← BACK TO APP</button>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{fontSize:13,letterSpacing:6,color:"#e07b20",marginBottom:16}}>🍃 SEND A MESSAGE</div>
          <h1 style={{fontSize:48,fontWeight:900,background:"linear-gradient(135deg,#ff6b00,#ffd700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:0}}>CONTACT US</h1>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(224,123,32,0.2)",borderRadius:16,padding:"36px 28px",textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:16}}>📬</div>
          <p style={{fontSize:15,color:"#c4b49a",lineHeight:1.8,marginBottom:28}}>Have questions or feedback? Reach out — every message is a scroll from a fellow ninja. 🥷</p>
          <div style={{background:"rgba(224,123,32,0.1)",border:"1px solid rgba(224,123,32,0.3)",borderRadius:12,padding:"20px 24px",marginBottom:16}}>
            <div style={{fontSize:18,fontWeight:700,color:"#ffd700",marginBottom:8}}>Deeksha S R</div>
            <div style={{fontSize:14,color:"#e07b20",marginBottom:16}}>deekshastalwart07@gmail.com</div>
            <button onClick={handleCopy} style={{background:copied?"rgba(0,200,100,0.2)":"rgba(224,123,32,0.2)",border:`1px solid ${copied?"rgba(0,200,100,0.4)":"rgba(224,123,32,0.4)"}`,color:copied?"#00c864":"#e07b20",padding:"10px 24px",borderRadius:8,cursor:"pointer",fontSize:12,letterSpacing:2,fontFamily:"'Cinzel',serif"}}>
              {copied?"✓ COPIED!":"COPY EMAIL"}
            </button>
          </div>
          <a href="mailto:deekshastalwart07@gmail.com" style={{display:"inline-block",background:"linear-gradient(135deg,#e07b20,#ffd700)",color:"#0a0a0f",padding:"14px 32px",borderRadius:10,textDecoration:"none",fontSize:13,fontWeight:700,letterSpacing:2}}>✉️ SEND EMAIL</a>
        </div>
        <div style={{textAlign:"center",marginTop:40,color:"#4a3f30",fontSize:12,letterSpacing:2}}>BELIEVE IT. BUILD IT. BECOME IT.</div>
      </div>
    </div>
  );
}

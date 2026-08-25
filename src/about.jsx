import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0f 0%, #1a0a00 50%, #0a0a0f 100%)",
      fontFamily: "'Cinzel', serif",
      color: "#f5e6c8",
      padding: "40px 20px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background effects */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(ellipse at 20% 50%, rgba(255,100,0,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,165,0,0.05) 0%, transparent 60%)",
        pointerEvents: "none"
      }} />

      <div style={{
        maxWidth: 700,
        margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.8s ease"
      }}>
        <button onClick={()=>navigate("/")} style={{background:"transparent",border:"1px solid rgba(224,123,32,0.3)",color:"#e07b20",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:12,letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:24}}>← BACK TO APP</button>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            fontSize: 13,
            letterSpacing: 6,
            color: "#e07b20",
            marginBottom: 16,
            textTransform: "uppercase"
          }}>
            🍃 HIDDEN LEAF VILLAGE
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 6vw, 48px)",
            fontWeight: 900,
            background: "linear-gradient(135deg, #ff6b00, #ffd700, #ff6b00)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            lineHeight: 1.2
          }}>
            NINJA WAY
          </h1>
          <div style={{
            width: 80, height: 2,
            background: "linear-gradient(90deg, transparent, #e07b20, transparent)",
            margin: "16px auto"
          }} />
          <p style={{
            fontSize: 14,
            letterSpacing: 3,
            color: "#8a7a60",
            textTransform: "uppercase"
          }}>
            Your Productivity Dojo
          </p>
        </div>

        {/* About Card */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(224,123,32,0.2)",
          borderRadius: 16,
          padding: "32px 28px",
          marginBottom: 24,
          backdropFilter: "blur(10px)"
        }}>
          <h2 style={{
            fontSize: 13, letterSpacing: 4, color: "#e07b20",
            textTransform: "uppercase", marginBottom: 16, marginTop: 0
          }}>
            🎯 Our Mission
          </h2>
          <p style={{
            fontSize: 15, lineHeight: 1.8, color: "#c4b49a", margin: 0,
            fontFamily: "'Georgia', serif"
          }}>
            Ninja Way is a <strong style={{ color: "#ffd700" }}>gamified productivity app</strong> inspired
            by the world of Naruto. We believe that becoming the best version of yourself
            is the ultimate ninja mission. Track your daily tasks, build powerful habits,
            and level up your real life — just like your favorite shinobi.
          </p>
        </div>

        {/* Features */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(224,123,32,0.2)",
          borderRadius: 16,
          padding: "32px 28px",
          marginBottom: 24
        }}>
          <h2 style={{
            fontSize: 13, letterSpacing: 4, color: "#e07b20",
            textTransform: "uppercase", marginBottom: 24, marginTop: 0
          }}>
            ⚡ What We Offer
          </h2>
          {[
            { icon: "🥷", title: "Daily Missions", desc: "Complete tasks and earn XP like a true ninja" },
            { icon: "📈", title: "Rank System", desc: "Progress from Genin to Hokage as you grow" },
            { icon: "🔥", title: "Streak Tracking", desc: "Maintain your training streak to stay sharp" },
            { icon: "🎯", title: "Goal Setting", desc: "Set your ninja way and never lose sight of it" },
          ].map((f, i) => (
            <div key={i} style={{
              display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start"
            }}>
              <span style={{ fontSize: 24, minWidth: 32 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f5e6c8", marginBottom: 4 }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 13, color: "#8a7a60", fontFamily: "'Georgia', serif" }}>
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Creator */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(224,123,32,0.2)",
          borderRadius: 16,
          padding: "32px 28px"
        }}>
          <h2 style={{
            fontSize: 13, letterSpacing: 4, color: "#e07b20",
            textTransform: "uppercase", marginBottom: 16, marginTop: 0
          }}>
            👩‍💻 The Creator
          </h2>
          <p style={{
            fontSize: 15, lineHeight: 1.8, color: "#c4b49a", margin: 0,
            fontFamily: "'Georgia', serif"
          }}>
            Built with passion by <strong style={{ color: "#ffd700" }}>Deeksha S R</strong> — a developer
            who believes that the right tools can turn everyday goals into legendary achievements.
            This is my ninja way. 🍃
          </p>
        </div>

        {/* Footer note */}
        <div style={{ textAlign: "center", marginTop: 40, color: "#4a3f30", fontSize: 12, letterSpacing: 2 }}>
          BELIEVE IT. BUILD IT. BECOME IT.
        </div>
      </div>
    </div>
  );
}

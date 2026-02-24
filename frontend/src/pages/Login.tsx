import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { login as loginApi } from "@/api/auth";
import { Mail, Lock, Sparkles, ArrowRight } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      login(res.data.token, {
        _id: res.data.id,
        name: res.data.name,
        email: res.data.email,
      });
      toast.success("Login successful");
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Login failed"
          : "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px 12px 44px",
    background: "#f8f7ff",
    border: "1px solid #e4e1f5",
    borderRadius: "10px",
    color: "#1a1535",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box" as const,
  };

  const iconStyle = {
    position: "absolute" as const,
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#7b72a8",
    pointerEvents: "none" as const,
  };

  return (
    <div
      className="bg-mesh"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div className="animate-fade-in-up" style={{ width: "100%", maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #6c47ff, #a78bfa)",
              boxShadow: "0 8px 24px rgba(108,71,255,0.35)",
              marginBottom: "1rem",
            }}
          >
            <Sparkles size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: "#1a1535" }}>
            Welcome back
          </h1>
          <p style={{ color: "#7b72a8", marginTop: "0.4rem", fontSize: "0.9rem", marginBottom: 0 }}>
            Sign in to your NexShop account
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e4e1f5",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 8px 40px rgba(108,71,255,0.1), 0 2px 8px rgba(26,21,53,0.06)",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Email */}
            <div>
              <label htmlFor="email" style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.5rem", color: "#1a1535" }}>
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={iconStyle} />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#a78bfa";
                    e.target.style.boxShadow = "0 0 0 3px rgba(108,71,255,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e4e1f5";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.5rem", color: "#1a1535" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={iconStyle} />
                <input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#a78bfa";
                    e.target.style.boxShadow = "0 0 0 3px rgba(108,71,255,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e4e1f5";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "10px",
                border: "none",
                background: loading
                  ? "#c4b8ff"
                  : "linear-gradient(135deg, #6c47ff, #7c3aed)",
                color: "#fff",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 18px rgba(108,71,255,0.4)",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: "0.25rem",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 6px 24px rgba(108,71,255,0.55)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = loading
                  ? "none"
                  : "0 4px 18px rgba(108,71,255,0.4)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "#7b72a8", marginBottom: 0 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#6c47ff", fontWeight: 700, textDecoration: "none" }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

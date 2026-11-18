import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";
import { AppShell } from "./components/AppShell";
import { ToastProvider } from "./components/Toast";

const LogoSplash   = lazy(() => import("./pages/LogoSplashPage"));
const LandingPage  = lazy(() => import("./pages/LandingPage"));
const LoginPage    = lazy(() => import("./pages/LoginPage"));
const Dashboard    = lazy(() => import("./pages/Dashboard"));
const Inventory    = lazy(() => import("./pages/Inventory"));
const Donations    = lazy(() => import("./pages/Donations"));
const Distribution = lazy(() => import("./pages/Distribution"));
const Donors       = lazy(() => import("./pages/Donors"));

function Loader() {
  return (
    <div style={{ position:"fixed", inset:0, display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:"#070B14" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:"#00FFFF", opacity:0.5,
          animation:"bounce3 1.1s ease-in-out infinite", animationDelay:`${i*0.15}s` }} />
      ))}
    </div>
  );
}

/*
  LogoutOnVisit — mounts on public routes (/, /landing).
  If user is logged in, visiting these routes logs them out.
  This handles:
    - Browser back button to landing/home after login
    - Manually typing / or /landing in URL while logged in
*/
function LogoutOnVisit() {
  const { logout } = useAuth();
  const location = useLocation();
  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AuthProvider>
          <HashRouter>
            <ToastProvider />
            <Suspense fallback={<Loader />}>
              <Routes>

                {/* ── PUBLIC: logo entry ──────────────────────────────
                    Visiting / logs out (if logged in) and shows logo.
                    Logo → navigates to /landing                        */}
                <Route path="/" element={
                  <>
                    <LogoutOnVisit />
                    <LogoSplash />
                  </>
                } />

                {/* ── PUBLIC: landing page ────────────────────────────
                    Visiting /landing logs out (if logged in).
                    Landing → "Login" button → /login                   */}
                <Route path="/landing" element={
                  <>
                    <LogoutOnVisit />
                    <LandingPage />
                  </>
                } />

                {/* ── PUBLIC: login ───────────────────────────────────
                    After successful login → /dashboard                 */}
                <Route path="/login" element={
                  <>
                    <LogoutOnVisit />
                    <LoginPage />
                  </>
                } />

                {/* ── PROTECTED: all operational pages ───────────────
                    sessionStorage cleared on refresh = auto logout.
                    Any direct URL access checks session first.         */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppShell />}>
                    <Route path="/dashboard"     element={<Dashboard />} />
                    <Route path="/inventory"     element={<Inventory />} />
                    <Route path="/donations"     element={<Donations />} />
                    <Route path="/distributions" element={<Distribution />} />
                    <Route path="/donors"        element={<Donors />} />
                  </Route>
                </Route>

                {/* ── CATCH-ALL: unknown URL → logo entry ─────────── */}
                <Route path="*" element={<Navigate to="/" replace />} />

              </Routes>
            </Suspense>
          </HashRouter>
        </AuthProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}

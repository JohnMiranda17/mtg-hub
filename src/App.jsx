import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Nav          from './components/Nav';
import Hub          from './pages/Hub';
import Helper       from './pages/Helper';
import Collection   from './pages/Collection';
import Prices       from './pages/Prices';
import BoardState   from './pages/BoardState';
import AuthPage     from './pages/Auth';
import ProfileSetup from './pages/ProfileSetup';
import Friends      from './pages/Friends';
import Feed         from './pages/Feed';
import Trading      from './pages/Trading';
import Combos       from './pages/Combos';
import MtglePage    from './pages/MtglePage';
import './App.css';

// Redirect to profile setup if user just signed up and hasn't chosen a username yet
function RequireProfileSetup({ children }) {
  const { user, profile, loading, profileComplete } = useAuth();
  if (loading) return null;
  if (user && profile && !profileComplete) return <Navigate to="/setup" replace />;
  return children;
}

function AppRoutes() {
  return (
    <div className="app">
      <Nav />
      <main className="app-main">
        <Routes>
          <Route path="/"           element={<RequireProfileSetup><Hub /></RequireProfileSetup>} />
          <Route path="/helper"     element={<RequireProfileSetup><Helper /></RequireProfileSetup>} />
          <Route path="/collection"  element={<RequireProfileSetup><Collection /></RequireProfileSetup>} />
          <Route path="/prices"      element={<RequireProfileSetup><Prices /></RequireProfileSetup>} />
          <Route path="/board-state" element={<RequireProfileSetup><BoardState /></RequireProfileSetup>} />
          <Route path="/combos"     element={<RequireProfileSetup><Combos /></RequireProfileSetup>} />
          <Route path="/mtgle"      element={<RequireProfileSetup><MtglePage /></RequireProfileSetup>} />
          <Route path="/feed"       element={<RequireProfileSetup><Feed /></RequireProfileSetup>} />
          <Route path="/friends"    element={<RequireProfileSetup><Friends /></RequireProfileSetup>} />
          <Route path="/trading"    element={<RequireProfileSetup><Trading /></RequireProfileSetup>} />
          <Route path="/login"      element={<AuthPage />} />
          <Route path="/setup"      element={<ProfileSetup />} />
        </Routes>
      </main>
      <footer className="app-footer">
        MTG Hub — fan-made toolkit · Magic: The Gathering © Wizards of the Coast ·
        Prices & card data via <a href="https://scryfall.com" target="_blank" rel="noreferrer">Scryfall</a>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

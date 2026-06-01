import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav      from './components/Nav';
import Hub      from './pages/Hub';
import Helper   from './pages/Helper';
import Collection from './pages/Collection';
import Prices   from './pages/Prices';
import BoardState from './pages/BoardState';
import './App.css';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="app">
        <Nav />
        <main className="app-main">
          <Routes>
            <Route path="/"           element={<Hub />} />
            <Route path="/helper"     element={<Helper />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/prices"     element={<Prices />} />
            <Route path="/board"      element={<BoardState />} />
          </Routes>
        </main>
        <footer className="app-footer">
          MTG Hub — fan-made toolkit · Magic: The Gathering © Wizards of the Coast ·
          Prices & card data via <a href="https://scryfall.com" target="_blank" rel="noreferrer">Scryfall</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

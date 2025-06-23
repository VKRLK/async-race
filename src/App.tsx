import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GaragePage } from './pages/GaragePage/GaragePage';
import WinnerPage from './pages/WinnerPage/WinnerPage';
import './App.scss';

function App() {
  return (
    <BrowserRouter basename="/async-race">
      <Routes>
        <Route path="/" element={<Navigate to="/garage" />} />
        <Route path="/garage" element={<GaragePage />} />
        <Route path="/winners" element={<WinnerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

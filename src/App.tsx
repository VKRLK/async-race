import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GaragePage } from './pages/GaragePage/GaragePage';
import WinnerPage from './pages/WinnerPage/WinnerPage';

function App() {
  return (
    <BrowserRouter basename="/async-race">
      <Routes>
        <Route path="/garage" element={<GaragePage />} />
        <Route path="/winners" element={<WinnerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

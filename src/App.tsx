import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TemplateCreate from './pages/TemplateCreate';
import StageStatusUpdate from './pages/StageStatusUpdate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TemplateCreate />} />
        <Route path="/stage-status-update" element={<StageStatusUpdate />} />
      </Routes>
    </Router>
  );
}

export default App;

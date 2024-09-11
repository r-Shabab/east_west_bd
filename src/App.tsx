import './App.css';
// import CardLayout from './pages/CardLayout';
// import stageData from './constants/stageData.json';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TemplateCreate from './pages/TemplateCreate';
import StageStatusUpdate from './pages/StageStatusUpdate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TemplateCreate />} />
        <Route path="/stage-status-update" element={<StageStatusUpdate />} />
        {/* <CandidateProfile></CandidateProfile>
      <CandidateProfileFlow></CandidateProfileFlow> */}
        {/* <CardLayout></CardLayout> */}
        {/* <TemplateCreate></TemplateCreate> */}
        {/* <StageStatusUpdate
        templateId={stageData.templateId}
        templateName={stageData.templateName}
        nodes={stageData.nodes}
        edges={stageData.edges}
      /> */}
      </Routes>
    </Router>
  );
}

export default App;

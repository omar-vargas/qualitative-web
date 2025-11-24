import './App.css';
import Sidebar from './components/Sidebar';
import { Routes, Route, Navigate } from 'react-router-dom';
import DataPage from './pages/DataPage';
import MultiFileUpload from './pages/MultiFileUpload';
import LoginPage from './pages/LoginPage';
import Step1Upload from './pages/Step1Upload.jsx';
import { useSession } from './context/SessionContext';
import Step2Generar from './pages/Step2Generar';
import Step3Feedback from './pages/Step3Feedback'
import TextHighlighter from './pages/TextHighlighter.jsx';
import ResaltadorPorArchivo from './pages/ResaltadorporArchivo.jsx';
import TutorialInteractivo from './pages/TutorialInteractivo.jsx';
import Home from './pages/Home';
import Summary from './pages/Summary';
import EmbeddingsView from './pages/EmbeddingsView';
import Survey from './pages/Survey';
import Taxonomy from './pages/Taxonomy';
import ClusteringComparison from './pages/ClusteringComparison';
import { Box } from '@mui/material';

function App() {
  const { session } = useSession();

  return (
    <Box sx={{ display: 'flex' }}>
      {session && <Sidebar />}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={session ? <Navigate to="/home" /> : <LoginPage />} />
          {session && (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/step1" element={<Step1Upload />} />
              <Route path="/step3" element={<Step3Feedback />} />
              <Route path="/step2" element={<Step2Generar />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/embeddings" element={<EmbeddingsView />} />
              <Route path="/data" element={<DataPage />} />
              <Route path="/label" element={<ResaltadorPorArchivo />} />
              <Route path="/tutorial" element={<TutorialInteractivo />} />
              <Route path="/taxonomy" element={<Taxonomy />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="/clustering-comparison" element={<ClusteringComparison />} />
            </>
          )}
          {!session && <Route path="*" element={<Navigate to="/" />} />}
        </Routes>
      </Box>
    </Box>
  );
}

export default App;

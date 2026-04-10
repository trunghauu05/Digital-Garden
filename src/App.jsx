import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Notes from './pages/Notes';
import NoteReader from './pages/NoteReader';
import FUO from './pages/FUO';
import FUOSemester from './pages/FUOSemester';
import FUOSubjectExams from './pages/FUOSubjectExams';
import FUOExamViewer from './pages/FUOExamViewer';
import FUOSubjectVariantExams from './pages/FUOSubjectVariantExams';
import './App.css';
function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">🌱 Digital Garden</Link>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Trang Chủ</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/notes">Tài Liệu</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/fuo">FUO</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/fuo" element={<FUO />} />
          <Route path="/fuo/ky/:ky" element={<FUOSemester />} />
          <Route path="/fuo/ky/:ky/:subject" element={<FUOSubjectExams />} />
          <Route path="/fuo/ky/:ky/:subject/:variant" element={<FUOSubjectVariantExams />} />
          <Route path="/fuo/ky/:ky/:subject/:variant/:examId" element={<FUOExamViewer />} />
          <Route path="/note/:slug" element={<NoteReader />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
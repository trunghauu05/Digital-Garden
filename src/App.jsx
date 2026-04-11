import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Notes from './pages/Notes';
import NoteReader from './pages/NoteReader';
import FUO from './pages/FUO';
import FUOSemester from './pages/FUOSemester';
import FUOSubjectExams from './pages/FUOSubjectExams';
import FUOExamViewer from './pages/FUOExamViewer';
import FUOSubjectVariantExams from './pages/FUOSubjectVariantExams';
import './App.css';

function AppLayout() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname, location.search]);

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3 mb-md-4">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">🌱 Digital Garden</Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNav}
            aria-controls="main-navbar"
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="main-navbar">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Trang Chu</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/notes">Tai Lieu</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/fuo">FUO</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="app-content container-fluid">
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
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
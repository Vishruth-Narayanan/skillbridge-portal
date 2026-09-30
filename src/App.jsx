import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import ResumeUpload from './pages/student/ResumeUpload';
import OnlineTest from './pages/student/OnlineTest';
import SkillMap from './pages/student/SkillMap';
import SoftSkills from './pages/student/SoftSkills';

// Industry Pages
import IndustryDashboard from './pages/industry/Dashboard';
import PostJob from './pages/industry/PostJob';
import ResumeFilter from './pages/industry/ResumeFilter';
import Interviews from './pages/industry/Interviews';

// Institution Pages
import InstitutionDashboard from './pages/institution/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />

              {/* Student Routes */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/resume" element={<ResumeUpload />} />
              <Route path="/student/test" element={<OnlineTest />} />
              <Route path="/student/skills" element={<SkillMap />} />
              <Route path="/student/soft-skills" element={<SoftSkills />} />

              {/* Industry Routes */}
              <Route path="/industry/dashboard" element={<IndustryDashboard />} />
              <Route path="/industry/post-job" element={<PostJob />} />
              <Route path="/industry/resumes" element={<ResumeFilter />} />
              <Route path="/industry/interviews" element={<Interviews />} />

              {/* Institution Routes */}
              <Route path="/institution/dashboard" element={<InstitutionDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="border-b border-[#DCCDB6] bg-[#FFFBF3]">
            <div className="max-w-6xl w-full mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-serif text-[#2B1D14] tracking-tight">
                    SkillBridge
                </Link>

                <div className="flex gap-6 items-center">
                    {!user && (
                        <Link
                            to="/login"
                            className="text-[#2B1D14] hover:text-[#C4562B] transition-colors font-medium"
                        >
                            Log in
                        </Link>
                    )}

                    {user && user.role === 'Student' && (
                        <>
                            <Link to="/student/dashboard" className="text-[#2B1D14] hover:text-[#C4562B] transition-colors font-medium">Dashboard</Link>
                            <Link to="/student/resume" className="text-[#2B1D14] hover:text-[#C4562B] transition-colors font-medium">Resume</Link>
                            <Link to="/student/skills" className="text-[#2B1D14] hover:text-[#C4562B] transition-colors font-medium">Skills</Link>
                            <Link to="/student/soft-skills" className="text-[#2B1D14] hover:text-[#C4562B] transition-colors font-medium">Soft Skills</Link>
                            <Link to="/student/test" className="text-[#2B1D14] hover:text-[#C4562B] transition-colors font-medium">Test</Link>
                        </>
                    )}

                    {user && user.role === 'Recruiter' && (
                        <>
                            <Link to="/industry/dashboard" className="text-[#2B1D14] hover:text-[#C4562B] transition-colors font-medium">Dashboard</Link>
                            <Link to="/industry/post-job" className="text-[#2B1D14] hover:text-[#C4562B] transition-colors font-medium">Post Job</Link>
                            <Link to="/industry/resumes" className="text-[#2B1D14] hover:text-[#C4562B] transition-colors font-medium">Resumes</Link>
                            <Link to="/industry/interviews" className="text-[#2B1D14] hover:text-[#C4562B] transition-colors font-medium">Interviews</Link>
                        </>
                    )}

                    {user && user.role === 'Institution' && (
                        <>
                            <Link to="/institution/dashboard" className="text-[#2B1D14] hover:text-[#C4562B] transition-colors font-medium">Dashboard</Link>
                        </>
                    )}

                    {user && (
                        <button
                            onClick={handleLogout}
                            className="text-[#7A6552] hover:text-[#2B1D14] transition-colors text-sm ml-4"
                        >
                            Log out
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

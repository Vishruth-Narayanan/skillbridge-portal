import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Building2, BookOpen } from 'lucide-react';

export default function Login() {
    const [role, setRole] = useState(null);
    const [students, setStudents] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (role === 'Student') {
            fetchStudents();
        } else if (role === 'Recruiter') {
            fetchCompanies();
        }
    }, [role]);

    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.from('students').select('id, full_name, email');
        if (error) setError(error.message);
        else setStudents(data);
        setLoading(false);
    };

    const fetchCompanies = async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.from('companies').select('id, name');
        if (error) setError(error.message);
        else setCompanies(data);
        setLoading(false);
    };

    const handleStudentLogin = (student) => {
        login({ role: 'Student', id: student.id, data: student });
        navigate('/student/dashboard');
    };

    const handleRecruiterLogin = (company) => {
        login({ role: 'Recruiter', id: company.id, data: company });
        navigate('/industry/dashboard');
    };

    const handleInstitutionLogin = () => {
        login({ role: 'Institution' });
        navigate('/institution/dashboard');
    };

    return (
        <div className="max-w-2xl mx-auto py-12 flex flex-col gap-8">
            <div>
                <h1 className="text-4xl">Select Your Role</h1>
                <p className="text-[#7A6552] mt-2">To explore the portal, select a mock role mimicking our real users.</p>
            </div>

            {!role && (
                <div className="grid md:grid-cols-3 gap-6 mt-4">
                    <button onClick={() => setRole('Student')} className="card p-6 flex flex-col items-center gap-4 hover:border-[#C4562B] transition-colors cursor-pointer pb-8">
                        <User size={32} className="text-[#C4562B]" />
                        <span className="font-serif text-xl">Student</span>
                    </button>
                    <button onClick={() => setRole('Recruiter')} className="card p-6 flex flex-col items-center gap-4 hover:border-[#4F6B4A] transition-colors cursor-pointer pb-8">
                        <Building2 size={32} className="text-[#4F6B4A]" />
                        <span className="font-serif text-xl">Recruiter</span>
                    </button>
                    <button onClick={() => setRole('Institution')} className="card p-6 flex flex-col items-center gap-4 hover:border-[#E0A526] transition-colors cursor-pointer pb-8">
                        <BookOpen size={32} className="text-[#E0A526]" />
                        <span className="font-serif text-xl">Institution</span>
                    </button>
                </div>
            )}

            {role === 'Student' && (
                <div className="card p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl mt-0">Login as Student</h2>
                        <button onClick={() => setRole(null)} className="text-[#C4562B] text-sm font-medium">← Back</button>
                    </div>

                    {loading ? (
                        <p className="text-[#7A6552]">Loading students from Supabase...</p>
                    ) : error ? (
                        <p className="text-red-700 bg-red-50 p-4 rounded border border-red-200">{error}</p>
                    ) : (
                        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                            {students.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => handleStudentLogin(s)}
                                    className="text-left p-4 border border-[#DCCDB6] rounded bg-[#FFFBF3] hover:bg-[#F6EFE4] transition-colors flex flex-col gap-1 cursor-pointer"
                                >
                                    <span className="font-medium text-[#2B1D14]">{s.full_name}</span>
                                    <span className="text-sm text-[#7A6552]">{s.email}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {role === 'Recruiter' && (
                <div className="card p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl mt-0">Login as Recruiter</h2>
                        <button onClick={() => setRole(null)} className="text-[#C4562B] text-sm font-medium">← Back</button>
                    </div>

                    {loading ? (
                        <p className="text-[#7A6552]">Loading companies from Supabase...</p>
                    ) : error ? (
                        <p className="text-red-700 bg-red-50 p-4 rounded border border-red-200">{error}</p>
                    ) : (
                        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                            {companies.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => handleRecruiterLogin(c)}
                                    className="text-left p-4 border border-[#DCCDB6] rounded bg-[#FFFBF3] hover:bg-[#F6EFE4] transition-colors flex flex-col gap-1 cursor-pointer"
                                >
                                    <span className="font-medium text-[#2B1D14]">{c.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {role === 'Institution' && (
                <div className="card p-8 text-center flex flex-col items-center gap-6">
                    <h2 className="text-2xl mt-0">Login as Institution</h2>
                    <p className="text-[#7A6552]">Enter the institutional administration dashboard to manage students, view analytics, and coordinate with companies.</p>
                    <button onClick={handleInstitutionLogin} className="btn-primary w-full md:w-auto px-8">
                        Enter Dashboard
                    </button>
                    <button onClick={() => setRole(null)} className="text-[#7A6552] text-sm mt-2">Return to role selection</button>
                </div>
            )}
        </div>
    );
}

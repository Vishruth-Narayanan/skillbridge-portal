import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Filter, Search, UserCheck } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function ResumeFilter() {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [minCgpa, setMinCgpa] = useState('');

    useEffect(() => {
        if (user && user.role === 'Recruiter') {
            fetchStudents();
        }
    }, [user]);

    const fetchStudents = async () => {
        setLoading(true);
        let query = supabase
            .from('students')
            .select(`
         id, full_name, college, department, cgpa, resume_score,
         student_skills ( level, skills ( name ) )
      `)
            .order('resume_score', { ascending: false });

        const { data: rawStudents } = await query;

        if (rawStudents) {
            setStudents(rawStudents.map(s => ({
                ...s,
                skillList: s.student_skills.map(sk => sk.skills.name).join(', ')
            })));
        }
        setLoading(false);
    };

    const filteredStudents = students.filter(s => {
        const matchSearch = s.full_name.toLowerCase().includes(search.toLowerCase()) ||
            s.skillList.toLowerCase().includes(search.toLowerCase());
        const matchCgpa = minCgpa ? s.cgpa >= parseFloat(minCgpa) : true;
        return matchSearch && matchCgpa;
    });

    if (!user || user.role !== 'Recruiter') return <Navigate to="/login" replace />;

    return (
        <div className="py-6 flex flex-col gap-8 max-w-6xl mx-auto">

            <div className="flex flex-col gap-2 border-b border-[#DCCDB6] pb-6">
                <h1 className="m-0 text-4xl font-serif">Resume & Talent Filter</h1>
                <p className="text-[#7A6552]">Discover students matching your exact criteria based on algorithmically assigned resume scores.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">

                {/* Filter Sidebar */}
                <div className="md:w-1/3 flex flex-col gap-6">
                    <div className="card p-6 bg-[#F6EFE4]">
                        <h3 className="flex items-center gap-2 m-0 mb-4 font-serif text-lg">
                            <Filter size={18} className="text-[#C4562B]" />
                            Refine Search
                        </h3>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-[#7A6552]">Keyword or Skill</label>
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-3 text-[#7A6552]" />
                                    <input
                                        type="text"
                                        placeholder="e.g. React, Python"
                                        value={search} onChange={e => setSearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-[#DCCDB6] rounded bg-[#FFFBF3] focus:border-[#C4562B] focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-[#7A6552]">Minimum CGPA</label>
                                <input
                                    type="number" step="0.5" min="0" max="10"
                                    placeholder="Any"
                                    value={minCgpa} onChange={e => setMinCgpa(e.target.value)}
                                    className="w-full px-3 py-2 border border-[#DCCDB6] rounded bg-[#FFFBF3] focus:border-[#C4562B] focus:outline-none"
                                />
                            </div>

                            <div className="divider my-2"></div>

                            <button onClick={() => { setSearch(''); setMinCgpa(''); }} className="text-sm text-[#C4562B] hover:underline self-start">
                                Clear all filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Area */}
                <div className="md:w-2/3 flex flex-col gap-4">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[#7A6552] text-sm">{filteredStudents.length} candidates found</span>
                        <span className="text-[#7A6552] text-sm">Sorted by Resume Score</span>
                    </div>

                    {loading ? (
                        <p className="text-[#7A6552]">Analyzing candidate database...</p>
                    ) : filteredStudents.length === 0 ? (
                        <div className="card p-12 text-center text-[#7A6552]">
                            No candidates matched the current filter configurations.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {filteredStudents.map(student => (
                                <div key={student.id} className="card p-6 flex flex-col gap-4 hover:border-[#4F6B4A] transition-colors cursor-pointer">

                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="m-0 text-xl font-serif text-[#2B1D14] flex items-center gap-2">
                                                {student.full_name}
                                                {student.resume_score > 85 && <UserCheck size={16} className="text-[#4F6B4A]" title="Top Percentile" />}
                                            </h3>
                                            <p className="text-sm text-[#7A6552]">{student.college} • {student.department}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-serif text-[#C4562B]">{student.resume_score}</div>
                                            <div className="text-xs uppercase font-bold text-[#7A6552] tracking-wider">Score</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 text-sm mt-2 pt-4 border-t border-[#F6EFE4]">
                                        <span className="bg-[#F6EFE4] px-2 py-1 rounded text-[#7A6552]">CGPA: <strong className="text-[#2B1D14]">{student.cgpa}</strong></span>
                                        <span className="text-[#7A6552] truncate">
                                            <strong>Skills:</strong> {student.skillList || 'None mapped'}
                                        </span>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Calendar, FileText, BarChart3, GraduationCap } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useAuth();
    const [student, setStudent] = useState(null);
    const [skills, setSkills] = useState([]);
    const [applications, setApplications] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user && user.role === 'Student') {
            fetchStudentData(user.id);
        }
    }, [user]);

    const fetchStudentData = async (studentId) => {
        setLoading(true);
        setError(null);
        try {
            // Fetch student details
            const { data: studentData, error: studentError } = await supabase
                .from('students')
                .select('*')
                .eq('id', studentId)
                .single();
            if (studentError) throw studentError;
            setStudent(studentData);

            // Fetch skills
            const { data: skillsData, error: skillsError } = await supabase
                .from('student_skills')
                .select(`
          level,
          skills ( name, category )
        `)
                .eq('student_id', studentId);
            if (skillsError) throw skillsError;

            const formattedSkills = skillsData.map(s => ({
                name: s.skills.name,
                category: s.skills.category,
                level: s.level
            }));
            setSkills(formattedSkills);

            // Fetch applications alongside job details
            const { data: appsData, error: appsError } = await supabase
                .from('applications')
                .select(`
          id, status, match_score,
          jobs ( title, companies ( name ) )
        `)
                .eq('student_id', studentId);
            if (appsError) throw appsError;

            const formattedApps = appsData.map(a => ({
                id: a.id,
                status: a.status,
                matchScore: a.match_score,
                jobTitle: a.jobs?.title,
                companyName: a.jobs?.companies?.name
            }));
            setApplications(formattedApps);

            // Fetch interviews alongside job details
            const { data: interviewsData, error: interviewsError } = await supabase
                .from('interviews')
                .select(`
          id, type, scheduled_at, status,
          jobs ( title, companies ( name ) )
        `)
                .eq('student_id', studentId);
            if (interviewsError) throw interviewsError;

            const formattedInterviews = interviewsData.map(i => ({
                id: i.id,
                type: i.type,
                scheduledAt: new Date(i.scheduled_at),
                status: i.status,
                jobTitle: i.jobs?.title,
                companyName: i.jobs?.companies?.name
            }));
            setInterviews(formattedInterviews);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Ensure only students can access
    if (!user || user.role !== 'Student') {
        return <Navigate to="/login" replace />;
    }

    if (loading) {
        return <div className="py-12 flex justify-center text-[#7A6552]">Loading dashboard data...</div>;
    }

    if (error) {
        return <div className="py-12 text-red-700">Error loading dashboard: {error}</div>;
    }

    if (!student) return null;

    return (
        <div className="flex flex-col gap-8 py-6">

            {/* Header Profile Section */}
            <section className="card p-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border-t-4 border-t-[#C4562B]">
                <div className="flex gap-6 items-center">
                    <div className="w-20 h-20 bg-[#F6EFE4] rounded-full flex items-center justify-center border border-[#DCCDB6]">
                        <GraduationCap size={40} className="text-[#7A6552]" />
                    </div>
                    <div>
                        <h1 className="text-3xl m-0">{student.full_name}</h1>
                        <p className="text-[#7A6552] text-lg">{student.college} • {student.department}, Year {student.year}</p>
                        <div className="text-sm text-[#7A6552] mt-1">{student.city}</div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="bg-[#FFFBF3] border border-[#DCCDB6] px-4 py-2 rounded text-center">
                        <div className="text-sm text-[#7A6552]">CGPA</div>
                        <div className="text-xl font-serif text-[#C4562B]">{student.cgpa}</div>
                    </div>
                    <div className="bg-[#FFFBF3] border border-[#DCCDB6] px-4 py-2 rounded text-center">
                        <div className="text-sm text-[#7A6552]">Resume Score</div>
                        <div className="text-xl font-serif text-[#4F6B4A]">{student.resume_score}/100</div>
                    </div>
                </div>
            </section>

            <div className="grid md:grid-cols-3 gap-8">

                {/* Left Column: Skills Map */}
                <div className="md:col-span-1 flex flex-col gap-6">
                    <section className="card p-6 h-full">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart3 className="text-[#4F6B4A]" size={24} />
                            <h2 className="m-0">Skill Mastery</h2>
                        </div>

                        {skills.length === 0 ? (
                            <p className="text-[#7A6552] text-sm">No skills mapped yet. Take an assessment to map your skills.</p>
                        ) : (
                            <div className="flex flex-col gap-5">
                                {skills.map((skill, idx) => (
                                    <div key={idx} className="flex flex-col gap-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-[#2B1D14]">{skill.name}</span>
                                            <span className="text-[#7A6552]">Lvl {skill.level}</span>
                                        </div>
                                        <div className="w-full bg-[#F6EFE4] h-2 rounded overflow-hidden">
                                            <div
                                                className="h-full rounded"
                                                style={{
                                                    width: `${(skill.level / 5) * 100}%`,
                                                    backgroundColor: skill.category === 'soft' ? '#E0A526' : '#C4562B'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Right Column: Applications & Interviews */}
                <div className="md:col-span-2 flex flex-col gap-8">

                    <section className="card p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <FileText className="text-[#E0A526]" size={24} />
                            <h2 className="m-0">Active Applications</h2>
                        </div>

                        <div className="flex flex-col">
                            {applications.length === 0 ? (
                                <p className="text-[#7A6552] text-sm py-4 border-t border-[#DCCDB6]">No active applications.</p>
                            ) : (
                                <div className="divide-y divide-[#DCCDB6] border-t border-[#DCCDB6]">
                                    {applications.map(app => (
                                        <div key={app.id} className="py-4 flex justify-between items-center bg-[#FFFBF3] hover:bg-[#F6EFE4] transition-colors -mx-6 px-6 cursor-pointer">
                                            <div>
                                                <div className="font-medium text-[#2B1D14] text-lg">{app.jobTitle}</div>
                                                <div className="text-[#7A6552] text-sm">{app.companyName}</div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <div className="text-xs text-[#7A6552] uppercase tracking-wider font-bold">{app.status}</div>
                                                    <div className="text-sm font-serif text-[#C4562B]">{app.matchScore}% Match</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="card p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Calendar className="text-[#C4562B]" size={24} />
                            <h2 className="m-0">Upcoming Interviews</h2>
                        </div>

                        <div className="flex flex-col">
                            {interviews.length === 0 ? (
                                <p className="text-[#7A6552] text-sm py-4 border-t border-[#DCCDB6]">No interviews scheduled.</p>
                            ) : (
                                <div className="divide-y divide-[#DCCDB6] border-t border-[#DCCDB6]">
                                    {interviews.map(interview => (
                                        <div key={interview.id} className="py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2 bg-[#FFFBF3] hover:bg-[#F6EFE4] transition-colors -mx-6 px-6 cursor-pointer">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-[#F6EFE4] border border-[#DCCDB6] rounded p-2 text-center min-w-16">
                                                    <div className="text-xs uppercase text-[#7A6552]">{interview.scheduledAt.toLocaleString('default', { month: 'short' })}</div>
                                                    <div className="text-xl font-serif text-[#2B1D14]">{interview.scheduledAt.getDate()}</div>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-[#2B1D14] text-lg">{interview.companyName}</div>
                                                    <div className="text-[#7A6552] text-sm">{interview.type} • {interview.status}</div>
                                                </div>
                                            </div>
                                            <div className="text-sm text-[#7A6552] md:text-right">
                                                {interview.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

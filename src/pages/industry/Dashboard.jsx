import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Building2, Briefcase, Users, Calendar } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState({ jobs: 0, applicants: 0, interviews: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role === 'Recruiter') {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            // Fetch open jobs
            const { data: jobs } = await supabase
                .from('jobs')
                .select('id')
                .eq('company_id', user.id);

            const jobIds = jobs ? jobs.map(j => j.id) : [];

            // Fetch applications for these jobs
            const { count: appsCount } = await supabase
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .in('job_id', jobIds);

            // Fetch upcoming interviews
            const { count: interviewsCount } = await supabase
                .from('interviews')
                .select('*', { count: 'exact', head: true })
                .in('job_id', jobIds)
                .eq('status', 'scheduled');

            setMetrics({
                jobs: jobIds.length,
                applicants: appsCount || 0,
                interviews: interviewsCount || 0
            });
        } catch (e) {
            console.error("Dashboard error", e);
        }
        setLoading(false);
    };

    if (!user || user.role !== 'Recruiter') return <Navigate to="/login" replace />;

    return (
        <div className="py-6 flex flex-col gap-12 max-w-6xl mx-auto">

            <section className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end border-b border-[#DCCDB6] pb-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl m-0 font-serif leading-tight">Welcome, {user.data.name}</h1>
                    <p className="text-[#7A6552] text-xl">Recruiter Portal Dashboard</p>
                </div>
                <Link to="/industry/post-job" className="btn-primary flex items-center gap-2">
                    <Briefcase size={18} /> Post a New Role
                </Link>
            </section>

            {loading ? (
                <p className="text-[#7A6552]">Loading metrics...</p>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">

                    <div className="card p-8 flex flex-col items-center text-center gap-4 border-t-4 border-[#C4562B]">
                        <div className="w-16 h-16 rounded-full bg-[#F6EFE4] flex justify-center items-center">
                            <Briefcase size={28} className="text-[#C4562B]" />
                        </div>
                        <p className="text-[#7A6552] uppercase font-bold text-sm tracking-widest m-0">Active Postings</p>
                        <h2 className="text-6xl font-serif text-[#2B1D14] m-0">{metrics.jobs}</h2>
                        <Link to="/industry/post-job" className="text-[#C4562B] text-sm mt-2 hover:underline">Manage jobs →</Link>
                    </div>

                    <div className="card p-8 flex flex-col items-center text-center gap-4 border-t-4 border-[#4F6B4A]">
                        <div className="w-16 h-16 rounded-full bg-[#F6EFE4] flex justify-center items-center">
                            <Users size={28} className="text-[#4F6B4A]" />
                        </div>
                        <p className="text-[#7A6552] uppercase font-bold text-sm tracking-widest m-0">Pending Applicants</p>
                        <h2 className="text-6xl font-serif text-[#2B1D14] m-0">{metrics.applicants}</h2>
                        <Link to="/industry/resumes" className="text-[#4F6B4A] text-sm mt-2 hover:underline">Filter resumes →</Link>
                    </div>

                    <div className="card p-8 flex flex-col items-center text-center gap-4 border-t-4 border-[#E0A526]">
                        <div className="w-16 h-16 rounded-full bg-[#F6EFE4] flex justify-center items-center">
                            <Calendar size={28} className="text-[#E0A526]" />
                        </div>
                        <p className="text-[#7A6552] uppercase font-bold text-sm tracking-widest m-0">Upcoming Interviews</p>
                        <h2 className="text-6xl font-serif text-[#2B1D14] m-0">{metrics.interviews}</h2>
                        <Link to="/industry/interviews" className="text-[#E0A526] text-sm mt-2 hover:underline">View schedule →</Link>
                    </div>

                </div>
            )}

            <section className="card p-8 bg-[#2B1D14] text-[#F6EFE4] border-none flex flex-col md:flex-row gap-8 justify-between items-center">
                <div className="flex flex-col gap-2 max-w-xl">
                    <h3 className="font-serif text-2xl m-0 text-[#FFFBF3]">Direct Campus Recruitment Drive</h3>
                    <p className="text-[#DCCDB6] text-sm leading-relaxed">
                        Coordinate directly with institutions to bypass standard screening. Utilize our skill-mapping matrices to auto-shortlist top percentile students based on your exact framework needs before you step onto the campus.
                    </p>
                </div>
                <button onClick={() => alert("Initiating request to campus placement coordinator...")} className="bg-[#E0A526] text-[#2B1D14] px-6 py-3 rounded font-medium hover:bg-[#c9921c] transition-colors whitespace-nowrap cursor-pointer">
                    Schedule a Drive
                </button>
            </section>

        </div>
    );
}

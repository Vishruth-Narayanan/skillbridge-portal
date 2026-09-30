import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Building, TrendingUp, Users, Award } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState({ placements: 0, totalStudents: 0, topCompanies: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role === 'Institution') {
            fetchInsights();
        }
    }, [user]);

    const fetchInsights = async () => {
        try {
            // Get all students count
            const { count: studentCount } = await supabase
                .from('students')
                .select('*', { count: 'exact', head: true });

            // Get all placements for this year (assuming placeholder logic gets all)
            const { data: placementsData } = await supabase
                .from('placements')
                .select(`
           id, package_lpa,
           companies ( name )
        `);

            const placementsCount = placementsData ? placementsData.length : 0;

            // Determine top companies by placement count
            const companyCounts = {};
            if (placementsData) {
                placementsData.forEach(p => {
                    const cName = p.companies?.name || 'Unknown';
                    companyCounts[cName] = (companyCounts[cName] || 0) + 1;
                });
            }
            const topCompanies = Object.entries(companyCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([name, count]) => ({ name, count }));

            setMetrics({
                totalStudents: studentCount || 0,
                placements: placementsCount,
                topCompanies
            });
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    if (!user || user.role !== 'Institution') return <Navigate to="/login" replace />;

    return (
        <div className="py-6 flex flex-col gap-12 max-w-6xl mx-auto">

            <section className="flex flex-col gap-2 border-b border-[#DCCDB6] pb-6">
                <h1 className="text-4xl m-0 font-serif leading-tight text-[#2B1D14]">Institutional Analytics</h1>
                <p className="text-[#7A6552] text-xl">Overview of placement performance and student metrics.</p>
            </section>

            {loading ? (
                <p className="text-[#7A6552]">Compiling institutional data...</p>
            ) : (
                <div className="flex flex-col gap-12">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                        <div className="card p-6 flex flex-col gap-2 bg-[#F6EFE4]">
                            <div className="text-[#E0A526] mb-2"><Users size={24} /></div>
                            <div className="text-4xl font-serif text-[#2B1D14]">{metrics.totalStudents}</div>
                            <div className="text-sm uppercase tracking-widest text-[#7A6552] font-bold">Total Students Mapped</div>
                        </div>

                        <div className="card p-6 flex flex-col gap-2 bg-[#F6EFE4]">
                            <div className="text-[#4F6B4A] mb-2"><Award size={24} /></div>
                            <div className="text-4xl font-serif text-[#2B1D14]">{metrics.placements}</div>
                            <div className="text-sm uppercase tracking-widest text-[#7A6552] font-bold">Successfully Placed</div>
                        </div>

                        <div className="card p-6 flex flex-col gap-2 bg-[#F6EFE4]">
                            <div className="text-[#C4562B] mb-2"><TrendingUp size={24} /></div>
                            <div className="text-4xl font-serif text-[#2B1D14]">
                                {metrics.totalStudents > 0 ? Math.round((metrics.placements / metrics.totalStudents) * 100) : 0}%
                            </div>
                            <div className="text-sm uppercase tracking-widest text-[#7A6552] font-bold">Placement Rate</div>
                        </div>

                    </div>

                    <section className="grid md:grid-cols-2 gap-8">
                        <div className="card p-8 flex flex-col gap-6">
                            <h3 className="m-0 font-serif text-2xl flex items-center gap-2">
                                <Building size={24} className="text-[#2B1D14]" />
                                Top Hiring Partners (This Year)
                            </h3>

                            {metrics.topCompanies.length === 0 ? (
                                <p className="text-[#7A6552] italic text-sm">No placement data available yet.</p>
                            ) : (
                                <div className="flex flex-col divide-y divide-[#DCCDB6] border-t border-[#DCCDB6]">
                                    {metrics.topCompanies.map((c, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-4">
                                            <span className="font-medium text-lg">{c.name}</span>
                                            <span className="bg-[#FFFBF3] border border-[#DCCDB6] text-[#C4562B] font-serif rounded px-3 py-1">
                                                {c.count} Hires
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="card p-8 bg-[#4F6B4A] text-[#FFFBF3] border-none flex flex-col gap-4 justify-between">
                            <div>
                                <h3 className="m-0 font-serif text-2xl mb-4">Curriculum Alignment Alert</h3>
                                <p className="text-[#DCCDB6] leading-relaxed">
                                    Based on recent industry job postings and interview rejections, there is an emerging talent gap in <strong>Cloud Infrastructure</strong> mapped to your students.
                                </p>
                            </div>
                            <button onClick={() => alert("Loading data-driven curriculum advisory module...")} className="bg-[#FFFBF3] text-[#4F6B4A] px-6 py-3 rounded font-medium hover:bg-[#F6EFE4] transition-colors self-start mt-4 cursor-pointer">
                                Review Syllabus Recommendations
                            </button>
                        </div>
                    </section>
                </div>
            )}

        </div>
    );
}

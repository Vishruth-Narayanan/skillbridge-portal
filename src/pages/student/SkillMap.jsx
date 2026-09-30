import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Map, TrendingUp } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function SkillMap() {
    const { user } = useAuth();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role === 'Student') {
            fetchSkills();
        }
    }, [user]);

    const fetchSkills = async () => {
        const { data: skillsData } = await supabase
            .from('student_skills')
            .select(`
        level,
        skills ( name, category )
      `)
            .eq('student_id', user.id);

        if (skillsData) {
            setSkills(skillsData.map(s => ({
                name: s.skills.name,
                category: s.skills.category,
                level: s.level
            })));
        }
        setLoading(false);
    };

    if (!user || user.role !== 'Student') return <Navigate to="/login" replace />;

    const techSkills = skills.filter(s => s.category !== 'soft');

    return (
        <div className="py-6 flex flex-col gap-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 border-b border-[#DCCDB6] pb-4">
                <Map size={32} className="text-[#4F6B4A]" />
                <h1 className="m-0 text-3xl">Technical Skill Map</h1>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-6">
                    <h2 className="font-serif text-2xl text-[#2B1D14] m-0">Your Arsenal</h2>
                    <p className="text-[#7A6552]">
                        This graph maps your measured proficiency in technical competencies based on coursework, assessment tests, and uploaded project metrics.
                    </p>

                    {loading ? (
                        <p className="text-[#7A6552]">Loading skills...</p>
                    ) : techSkills.length === 0 ? (
                        <p className="text-[#7A6552] italic border p-4 bg-[#FFFBF3] rounded">No technical skills recorded. Take an assessment to map your abilities.</p>
                    ) : (
                        <div className="card p-6 flex flex-col gap-4">
                            {techSkills.map((skill, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-end">
                                        <span className="font-medium text-[#2B1D14]">{skill.name}</span>
                                        <span className="text-sm font-serif text-[#4F6B4A]">Lvl {skill.level}</span>
                                    </div>
                                    <div className="w-full bg-[#F6EFE4] h-3 rounded overflow-hidden">
                                        <div
                                            className="h-full bg-[#4F6B4A] rounded"
                                            style={{ width: `${(skill.level / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <div className="card p-8 bg-[#4F6B4A] text-[#FFFBF3] flex flex-col gap-4">
                        <TrendingUp size={32} className="text-[#DCCDB6]" />
                        <h3 className="text-xl m-0 font-serif">Pathways to Improvement</h3>
                        <p className="text-[#DCCDB6] text-sm leading-relaxed mb-4">
                            Your lowest indexed technical skill compared against current industry job postings is <strong>Cloud Architecture</strong>.
                        </p>
                        <button onClick={() => alert("Navigating to Coursera/Udemy recommended links...")} className="bg-[#FFFBF3] text-[#4F6B4A] font-medium py-2 px-4 rounded hover:bg-[#F6EFE4] transition-colors self-start cursor-pointer">
                            View Recommended Courses
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

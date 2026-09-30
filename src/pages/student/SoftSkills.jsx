import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { MessageSquare, Users2, Compass, AlertCircle, RefreshCw } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function SoftSkills() {
    const { user } = useAuth();
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role === 'Student') {
            fetchAssessment();
        }
    }, [user]);

    const fetchAssessment = async () => {
        const { data } = await supabase
            .from('soft_skill_assessments')
            .select('*')
            .eq('student_id', user.id)
            .single();

        if (data) {
            setAssessment(data);
        }
        setLoading(false);
    };

    if (!user || user.role !== 'Student') return <Navigate to="/login" replace />;

    const aspects = assessment ? [
        { label: 'Communication', score: assessment.communication, icon: MessageSquare, color: 'text-[#C4562B]' },
        { label: 'Teamwork', score: assessment.teamwork, icon: Users2, color: 'text-[#E0A526]' },
        { label: 'Problem Solving', score: assessment.problem_solving, icon: AlertCircle, color: 'text-[#4F6B4A]' },
        { label: 'Adaptability', score: assessment.adaptability, icon: RefreshCw, color: 'text-[#7A6552]' },
        { label: 'Leadership', score: assessment.leadership, icon: Compass, color: 'text-[#2B1D14]' },
    ] : [];

    return (
        <div className="py-6 flex flex-col gap-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 border-b border-[#DCCDB6] pb-4">
                <Users2 size={32} className="text-[#C4562B]" />
                <h1 className="m-0 text-3xl">Behavioral & Soft Skills</h1>
            </div>

            {loading ? (
                <p className="text-[#7A6552]">Loading assessments...</p>
            ) : !assessment ? (
                <div className="card p-12 text-center flex flex-col items-center gap-4 bg-[#F6EFE4]">
                    <MessageSquare size={48} className="text-[#DCCDB6]" />
                    <h2 className="text-xl m-0 font-serif">No Behavioral Data Found</h2>
                    <p className="text-[#7A6552] max-w-sm">Complete a behavioral psychology test or participate in a group discussion assessment to generate your soft skill map.</p>
                    <button onClick={() => alert("Redirecting to external behavioral assessment partner...")} className="btn-primary mt-4">Take Behavioral Assessment</button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div className="flex flex-col gap-6">
                        <h2 className="font-serif text-2xl text-[#2B1D14] m-0">Your Profile Overview</h2>
                        <p className="text-[#7A6552] leading-relaxed">
                            Your soft skill profile indicates strengths in <strong>Problem Solving</strong> and <strong>Teamwork</strong>.
                            Recruiters heavily weigh this metric when screening for culture fit. Ensure these scores accurately represent your interpersonal capabilities.
                        </p>

                        <div className="bg-[#FFFBF3] border-l-4 border-[#E0A526] p-6 rounded-r">
                            <h3 className="font-serif text-lg m-0 mb-2">Notice on Peer Reviews</h3>
                            <p className="text-sm text-[#7A6552]">
                                Scores are triangulated from standard assessments and recorded peer reviews during class project simulations.
                                <a href="#" className="text-[#C4562B] ml-1 underline decoration-[#F6EFE4] hover:decoration-[#C4562B]">Learn more.</a>
                            </p>
                        </div>
                    </div>

                    <div className="card p-8">
                        <div className="flex flex-col gap-8">
                            {aspects.map((aspect, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-[#F6EFE4] rounded-full flex items-center justify-center shrink-0 border border-[#DCCDB6]">
                                        <aspect.icon className={aspect.color} size={20} />
                                    </div>
                                    <div className="w-full">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="font-medium text-[#2B1D14]">{aspect.label}</span>
                                            <span className="font-serif text-[#7A6552]">{aspect.score}/10</span>
                                        </div>
                                        <div className="w-full bg-[#F6EFE4] h-2 rounded overflow-hidden">
                                            <div
                                                className="h-full bg-[#C4562B] rounded opacity-80"
                                                style={{ width: `${(aspect.score / 10) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

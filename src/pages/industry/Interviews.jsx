import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { CalendarDays, Video } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Interviews() {
    const { user } = useAuth();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role === 'Recruiter') {
            fetchInterviews();
        }
    }, [user]);

    const fetchInterviews = async () => {
        // Need to get interviews through jobs related to this company
        const { data: jobs } = await supabase
            .from('jobs')
            .select('id')
            .eq('company_id', user.id);

        const jobIds = jobs ? jobs.map(j => j.id) : [];

        if (jobIds.length > 0) {
            const { data } = await supabase
                .from('interviews')
                .select(`
          id, type, scheduled_at, status, notes,
          students ( full_name, college ),
          jobs ( title )
        `)
                .in('job_id', jobIds)
                .order('scheduled_at', { ascending: true });

            if (data) {
                setInterviews(data.map(i => ({
                    ...i,
                    dateObj: new Date(i.scheduled_at)
                })));
            }
        }
        setLoading(false);
    };

    if (!user || user.role !== 'Recruiter') return <Navigate to="/login" replace />;

    const upcomingInterviews = interviews.filter(i => i.status === 'scheduled');
    const pastInterviews = interviews.filter(i => i.status !== 'scheduled');

    const renderInterviewCard = (interview) => (
        <div key={interview.id} className="flex gap-6 p-4 border border-[#DCCDB6] rounded bg-[#FFFBF3] items-center">
            <div className="bg-[#E0A526] text-[#2B1D14] w-20 h-20 rounded flex flex-col justify-center items-center shrink-0">
                <span className="text-xs uppercase font-bold tracking-widest">{interview.dateObj.toLocaleString('default', { month: 'short' })}</span>
                <span className="text-2xl font-serif leading-none mt-1">{interview.dateObj.getDate()}</span>
            </div>

            <div className="w-full flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h3 className="m-0 text-xl text-[#2B1D14]">{interview.students?.full_name}</h3>
                    <span className="text-[#7A6552] text-sm">For {interview.jobs?.title} ({interview.type})</span>
                    <span className="text-[#7A6552] text-sm flex items-center gap-1 mt-1">
                        <CalendarDays size={14} />
                        {interview.dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <span className={`text-xs uppercase font-bold tracking-widest ${interview.status === 'scheduled' ? 'text-[#4F6B4A]' : 'text-[#7A6552]'}`}>{interview.status}</span>
                    {interview.status === 'scheduled' && (
                        <button className="flex items-center gap-1 text-[#C4562B] text-sm hover:underline">
                            <Video size={16} /> Join Call
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="py-6 flex flex-col gap-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 border-b border-[#DCCDB6] pb-4">
                <CalendarDays size={32} className="text-[#E0A526]" />
                <h1 className="m-0 text-3xl font-serif">Interview Schedule</h1>
            </div>

            {loading ? (
                <p className="text-[#7A6552]">Loading agenda...</p>
            ) : (
                <div className="flex flex-col gap-12">
                    <section>
                        <h2 className="text-xl font-serif text-[#C4562B] mb-6">Upcoming Next</h2>
                        {upcomingInterviews.length === 0 ? (
                            <p className="text-[#7A6552] italic">No upcoming interviews scheduled.</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {upcomingInterviews.map(renderInterviewCard)}
                            </div>
                        )}
                    </section>

                    <div className="divider"></div>

                    <section>
                        <h2 className="text-xl font-serif text-[#7A6552] mb-6">Past Interviews</h2>
                        {pastInterviews.length === 0 ? (
                            <p className="text-[#7A6552] italic">No past interview records found.</p>
                        ) : (
                            <div className="flex flex-col gap-4 opacity-70 hover:opacity-100 transition-opacity">
                                {pastInterviews.map(renderInterviewCard)}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}

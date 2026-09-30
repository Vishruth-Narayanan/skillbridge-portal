import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { UploadCloud, FileText } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function ResumeUpload() {
    const { user } = useAuth();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [summaryInput, setSummaryInput] = useState('');
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user && user.role === 'Student') {
            fetchStudent();
        }
    }, [user]);

    const fetchStudent = async () => {
        const { data, error } = await supabase
            .from('students')
            .select('resume_summary, resume_score')
            .eq('id', user.id)
            .single();
        if (!error && data) {
            setStudent(data);
            setSummaryInput(data.resume_summary || '');
        }
        setLoading(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage(null);
        const { error } = await supabase
            .from('students')
            .update({ resume_summary: summaryInput })
            .eq('id', user.id);

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Resume summary updated successfully.' });
            fetchStudent();
        }
        setUpdating(false);
    };

    if (!user || user.role !== 'Student') return <Navigate to="/login" replace />;

    return (
        <div className="py-6 flex flex-col gap-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 border-b border-[#DCCDB6] pb-4">
                <FileText size={32} className="text-[#C4562B]" />
                <h1 className="m-0 text-3xl">Resume & Profile</h1>
            </div>

            {loading ? (
                <p className="text-[#7A6552]">Loading profile details...</p>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <div className="card p-8">
                            <h2 className="text-xl mt-0 mb-4 flex items-center gap-2">
                                <UploadCloud className="text-[#4F6B4A]" size={20} />
                                Upload New Resume
                            </h2>
                            <div className="border-2 border-dashed border-[#DCCDB6] rounded-lg p-12 flex flex-col items-center justify-center text-center bg-[#F6EFE4]">
                                <p className="text-[#7A6552] mb-4">Drag and drop your latest PDF resume here</p>
                                <label className="btn-primary cursor-pointer">
                                    Browse Files
                                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            alert(`Mock Upload: ${e.target.files[0].name} successfully uploaded and parsed! ATS Score updated.`);
                                            fetchStudent();
                                        }
                                    }} />
                                </label>
                            </div>
                        </div>

                        <div className="card p-8">
                            <h2 className="text-xl mt-0 mb-4">Career Summary (Auto-parsed)</h2>
                            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                                <textarea
                                    className="w-full p-4 border border-[#DCCDB6] rounded bg-[#F6EFE4] text-[#2B1D14] min-h-[150px] font-sans"
                                    value={summaryInput}
                                    onChange={(e) => setSummaryInput(e.target.value)}
                                    placeholder="Your professional summary..."
                                />
                                <div className="flex justify-between items-center">
                                    {message ? (
                                        <span className={message.type === 'error' ? 'text-red-600 text-sm' : 'text-[#4F6B4A] text-sm'}>
                                            {message.text}
                                        </span>
                                    ) : <span></span>}
                                    <button type="submit" className="btn-primary" disabled={updating}>
                                        {updating ? 'Saving...' : 'Update Summary'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="card p-6 border-t-4 border-[#C4562B]">
                            <h3 className="text-lg mt-0 mb-2">Resume Score</h3>
                            <div className="text-5xl font-serif text-[#2B1D14] mb-4">{student?.resume_score}<span className="text-xl text-[#7A6552]">/100</span></div>
                            <p className="text-[#7A6552] text-sm">Based on ATS parsing, keyword density, and formatting against active industry job portals.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

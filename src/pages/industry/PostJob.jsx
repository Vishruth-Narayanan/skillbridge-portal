import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Briefcase } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function PostJob() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        type: 'Full-time',
        location: '',
        pay: '',
        description: '',
        min_cgpa: '',
        skills: '' // comma separated
    });
    const [status, setStatus] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    if (!user || user.role !== 'Recruiter') return <Navigate to="/login" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);

        const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);

        const { error } = await supabase.from('jobs').insert([{
            company_id: user.id,
            title: formData.title,
            type: formData.type,
            location: formData.location || user.data.location,
            pay: formData.pay,
            description: formData.description,
            min_cgpa: formData.min_cgpa ? parseFloat(formData.min_cgpa) : null,
            required_skills: skillsArray
        }]);

        setSubmitting(false);

        if (error) {
            setStatus({ type: 'error', message: error.message });
        } else {
            setStatus({ type: 'success', message: 'Job successfully posted.' });
            setFormData({ title: '', type: 'Full-time', location: '', pay: '', description: '', min_cgpa: '', skills: '' });
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="py-6 max-w-3xl mx-auto flex flex-col gap-8">
            <div className="flex items-center gap-3 border-b border-[#DCCDB6] pb-4">
                <Briefcase size={28} className="text-[#4F6B4A]" />
                <h1 className="m-0 text-3xl font-serif">Post a New Opportunity</h1>
            </div>

            <div className="card p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[#2B1D14]">Position Title</label>
                            <input
                                type="text" required name="title"
                                className="border border-[#DCCDB6] rounded p-3 bg-[#F6EFE4]"
                                value={formData.title} onChange={handleChange}
                                placeholder="e.g. Frontend Engineer"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[#2B1D14]">Employment Type</label>
                            <select
                                name="type"
                                className="border border-[#DCCDB6] rounded p-3 bg-[#F6EFE4]"
                                value={formData.type} onChange={handleChange}
                            >
                                <option>Full-time</option>
                                <option>Internship</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[#2B1D14]">Location (optional)</label>
                            <input
                                type="text" name="location"
                                className="border border-[#DCCDB6] rounded p-3 bg-[#F6EFE4]"
                                value={formData.location} onChange={handleChange}
                                placeholder={`Default: ${user.data.location}`}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[#2B1D14]">Remuneration (LPA / Stipend)</label>
                            <input
                                type="text" required name="pay"
                                className="border border-[#DCCDB6] rounded p-3 bg-[#F6EFE4]"
                                value={formData.pay} onChange={handleChange}
                                placeholder="e.g. 12 LPA or 30k/mo"
                            />
                        </div>
                    </div>

                    <div className="divider my-2"></div>

                    <h3 className="font-serif text-lg m-0 mb-[-10px] text-[#C4562B]">Academic & Skill Requirements</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[#2B1D14]">Minimum CGPA Cutoff</label>
                            <input
                                type="number" step="0.1" min="0" max="10" name="min_cgpa"
                                className="border border-[#DCCDB6] rounded p-3 bg-[#F6EFE4]"
                                value={formData.min_cgpa} onChange={handleChange}
                                placeholder="e.g. 7.5"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[#2B1D14]">Required Skills</label>
                            <input
                                type="text" required name="skills"
                                className="border border-[#DCCDB6] rounded p-3 bg-[#F6EFE4]"
                                value={formData.skills} onChange={handleChange}
                                placeholder="Comma separated, e.g. React, Node.js, AWS"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[#2B1D14]">Role Description</label>
                        <textarea
                            required name="description"
                            className="border border-[#DCCDB6] rounded p-3 bg-[#F6EFE4] min-h-[150px] font-sans"
                            value={formData.description} onChange={handleChange}
                            placeholder="Detail the responsibilities and expectations..."
                        />
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        {status ? (
                            <div className={`p-4 rounded text-sm max-w-sm ${status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                {status.message}
                            </div>
                        ) : (<div></div>)}
                        <button type="submit" className="btn-primary px-8 py-3 text-lg" disabled={submitting}>
                            {submitting ? 'Posting...' : 'Publish Listing'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

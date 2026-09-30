import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { BrainCircuit, Clock, CheckCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function OnlineTest() {
    const { user } = useAuth();
    const [tests, setTests] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Active testing state
    const [activeTest, setActiveTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({}); // question id -> option (option_a, option_b)
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user && user.role === 'Student') {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        const [testsRes, attemptsRes] = await Promise.all([
            supabase.from('tests').select('*'),
            supabase.from('test_attempts').select('*').eq('student_id', user.id)
        ]);

        if (testsRes.data) setTests(testsRes.data);
        if (attemptsRes.data) setAttempts(attemptsRes.data);
        setLoading(false);
    };

    const startTest = async (test) => {
        setActiveTest(test);
        setLoading(true);
        const { data } = await supabase.from('questions').select('*').eq('test_id', test.id);
        setQuestions(data || []);
        setLoading(false);
    };

    const submitTest = async () => {
        setSubmitting(true);
        // Calculate score
        let score = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correct_option) {
                score++;
            }
        });

        const { data } = await supabase.from('test_attempts').insert([{
            student_id: user.id,
            test_id: activeTest.id,
            score: score,
            total: questions.length
        }]).select().single();

        if (data) {
            setAttempts(prev => [...prev, data]);
        }

        setActiveTest(null);
        setQuestions([]);
        setAnswers({});
        setCurrentQ(0);
        setSubmitting(false);
    };

    const getAttempt = (testId) => attempts.find(a => a.test_id === testId);

    if (!user || user.role !== 'Student') return <Navigate to="/login" replace />;

    if (activeTest && questions.length > 0) {
        const q = questions[currentQ];
        const isLast = currentQ === questions.length - 1;

        return (
            <div className="py-12 max-w-3xl mx-auto flex flex-col gap-8">
                <div className="flex justify-between items-center bg-[#FFFBF3] p-4 border border-[#DCCDB6] rounded">
                    <h2 className="m-0 font-serif text-xl">{activeTest.title}</h2>
                    <span className="text-[#C4562B] font-medium">Question {currentQ + 1} of {questions.length}</span>
                </div>

                <div className="card p-8 flex flex-col gap-6">
                    <h3 className="text-xl leading-relaxed text-[#2B1D14]">{q.question}</h3>

                    <div className="flex flex-col gap-3">
                        {['option_a', 'option_b', 'option_c', 'option_d'].map(optKey => (
                            q[optKey] && (
                                <label
                                    key={optKey}
                                    className={`p-4 border rounded cursor-pointer transition-colors flex items-center gap-3 ${answers[q.id] === optKey ? 'border-[#C4562B] bg-[#F6EFE4]' : 'border-[#DCCDB6] hover:bg-[#F6EFE4]'}`}
                                >
                                    <input
                                        type="radio" name={`q_${q.id}`} value={optKey}
                                        checked={answers[q.id] === optKey}
                                        onChange={() => setAnswers(prev => ({ ...prev, [q.id]: optKey }))}
                                        className="accent-[#C4562B]"
                                    />
                                    <span>{q[optKey]}</span>
                                </label>
                            )
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    {currentQ > 0 ? (
                        <button onClick={() => setCurrentQ(v => v - 1)} className="text-[#7A6552]">← Previous</button>
                    ) : <div></div>}

                    {isLast ? (
                        <button onClick={submitTest} disabled={submitting} className="btn-primary">
                            {submitting ? 'Submitting...' : 'Submit Assessment'}
                        </button>
                    ) : (
                        <button onClick={() => setCurrentQ(v => v + 1)} className="bg-[#4F6B4A] text-[#FFFBF3] px-6 py-2 rounded">Next →</button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="py-6 flex flex-col gap-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between border-b border-[#DCCDB6] pb-4">
                <div className="flex items-center gap-4">
                    <BrainCircuit size={32} className="text-[#E0A526]" />
                    <h1 className="m-0 text-3xl">Online Assessments</h1>
                </div>
            </div>

            <p className="text-[#7A6552] text-lg max-w-2xl">
                Complete skill assessments to prove your capabilities to potential recruiters. High scores automatically boost your profile visibility.
            </p>

            {loading ? (
                <p className="text-[#7A6552]">Loading available assessments...</p>
            ) : tests.length === 0 ? (
                <p className="text-[#7A6552] italic">No active assessments available at this time.</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {tests.map(test => {
                        const attempt = getAttempt(test.id);
                        return (
                            <div key={test.id} className="card p-6 flex flex-col justify-between h-full hover:border-[#E0A526] transition-colors">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-serif text-[#2B1D14] m-0">{test.title}</h3>
                                        {attempt && <CheckCircle size={20} className="text-[#4F6B4A]" />}
                                    </div>
                                    <div className="flex gap-3 text-sm text-[#7A6552] mb-6">
                                        <span className="uppercase tracking-wider font-bold">{test.category}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Clock size={16} /> {test.duration_minutes} mins</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[#DCCDB6] flex items-center justify-between">
                                    {attempt ? (
                                        <div>
                                            <span className="text-sm text-[#7A6552]">Your Score:</span>
                                            <span className="ml-2 font-serif text-lg text-[#4F6B4A]">{attempt.score}/{attempt.total}</span>
                                        </div>
                                    ) : (
                                        <button onClick={() => startTest(test)} className="bg-[#E0A526] text-[#2B1D14] px-4 py-2 rounded font-medium hover:bg-[#c9921c] transition-colors text-sm cursor-pointer">
                                            Start Assessment
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Building2, GraduationCap } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col gap-24 py-12">
            {/* Hero Section */}
            <section className="grid md:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-6 items-start">
                    <h1 className="text-5xl md:text-6xl font-serif leading-tight">
                        Bridging the gap between <span className="text-[#C4562B]">academia</span> and <span className="text-[#4F6B4A]">industry.</span>
                    </h1>
                    <p className="text-lg text-[#7A6552] max-w-md leading-relaxed">
                        A dedicated portal for skills mapping, internships, and collegiate placements. Find the right talent, or the right opportunity, based on concrete merits.
                    </p>
                    <div className="flex gap-4 mt-2">
                        <Link to="/login" className="btn-primary flex items-center gap-2 px-6 py-3">
                            Get Started <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
                <div className="hidden md:block relative h-full min-h-[400px]">
                    <div className="absolute inset-0 bg-[#E0A526] opacity-10 rounded-lg transform rotate-1"></div>
                    <div className="relative h-full bg-[#FFFBF3] border border-[#DCCDB6] rounded-lg p-8 flex flex-col justify-between shadow-sm">
                        <div className="space-y-4">
                            <div className="h-4 bg-[#F6EFE4] rounded w-3/4"></div>
                            <div className="h-4 bg-[#F6EFE4] rounded w-1/2"></div>
                            <div className="h-4 bg-[#F6EFE4] rounded w-5/6"></div>
                        </div>
                        <div className="mt-12 flex items-end justify-between">
                            <div className="w-16 h-16 bg-[#C4562B] rounded-full opacity-20"></div>
                            <div className="w-32 h-32 bg-[#4F6B4A] rounded-md opacity-20"></div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="divider"></div>

            {/* Roles Section */}
            <section className="grid md:grid-cols-3 gap-8">
                <div className="card p-8 flex flex-col gap-4">
                    <GraduationCap className="text-[#C4562B] mb-2" size={32} />
                    <h3 className="text-2xl font-serif">For Students</h3>
                    <p className="text-[#7A6552]">
                        Build your skills profile, take technical and soft-skill assessments, and get matched with hiring partners based on your real capability rather than just a resume.
                    </p>
                </div>
                <div className="card p-8 flex flex-col gap-4">
                    <Building2 className="text-[#4F6B4A] mb-2" size={32} />
                    <h3 className="text-2xl font-serif">For Industry</h3>
                    <p className="text-[#7A6552]">
                        Filter candidates by verified skills, academic performance, and assessment scores. Post specialized roles and streamline campus recruitment.
                    </p>
                </div>
                <div className="card p-8 flex flex-col gap-4">
                    <BookOpen className="text-[#E0A526] mb-2" size={32} />
                    <h3 className="text-2xl font-serif">For Institutions</h3>
                    <p className="text-[#7A6552]">
                        Track placement metrics, oversee student progress in skills mapping, and collaborate directly with top recruiters visiting the campus.
                    </p>
                </div>
            </section>
        </div>
    );
}

import { useNavigate } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Target,
    Shield,
    TrendingUp,
    ArrowRight,
    Github,
    Linkedin,
    FileText
} from "lucide-react";
import TrueFocus from "@/components/TrueFocus";

export default function Dashboard() {
    const navigate = useNavigate();

    const features = [
        {
            icon: Target,
            title: "Skill Matching",
            desc: "AI identifies matching & missing skills",
        },
        {
            icon: Shield,
            title: "ATS Optimized",
            desc: "Beat applicant tracking systems",
        },
        {
            icon: TrendingUp,
            title: "Smart Suggestions",
            desc: "Personalized improvement tips",
        },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        },
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-65px)] bg-background font-analyzer overflow-x-hidden">
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-24 relative">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-6xl w-full space-y-16 z-10 flex flex-col items-center"
                >
                    {/* Hero Section */}
                    <motion.div variants={itemVariants} className="text-center space-y-8">
                        <div className="flex justify-center px-4">
                            <TrueFocus
                                sentence="Welcome to Resume Analyzer"
                                manualMode={false}
                                blurAmount={5}
                                borderColor="#5227FF"
                                glowColor="rgba(82, 39, 255, 0.4)"
                                animationDuration={0.5}
                                pauseBetweenAnimations={1}
                            />
                        </div>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal px-4">
                            Get instant AI-powered feedback on your resume. Optimize for ATS, match skills to job requirements, and land more interviews.
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
                        {features.map((feature, idx) => (
                            <Card key={idx} variant="gradient-underline" className="hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                                <CardContent className="p-8 md:p-10 flex flex-col items-center text-center space-y-6">
                                    <div className="p-4 bg-accent/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="w-8 h-8 text-accent" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>

                    {/* Action Area */}
                    <motion.div variants={itemVariants} className="text-center pt-4">
                        <Button
                            size="xl"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-9 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] group flex items-center gap-4"
                            onClick={() => navigate("/analyze")}
                        >
                            <FileText className="w-6 h-6" />
                            Analyze Resume Now
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                        </Button>
                    </motion.div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="w-full py-16 mt-auto">
                <div className="container mx-auto px-6 flex flex-col items-center gap-8">
                    <div className="flex items-center gap-10">
                        <a href="https://github.com/jainil224/resume-analyzer" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#4eaeff] transition-all duration-300 hover:scale-110">
                            <Github className="w-7 h-7" />
                        </a>
                        <a href="https://www.linkedin.com/in/jainil-patel-947b1a336/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#4eaeff] transition-all duration-300 hover:scale-110">
                            <Linkedin className="w-7 h-7" />
                        </a>
                    </div>
                    <div className="text-sm text-muted-foreground font-medium flex flex-col items-center gap-3">
                        <div className="flex items-center gap-3 opacity-90 text-[15px]">
                            <span>© 2025</span>
                            <span className="opacity-40">|</span>
                            <span>Developed by <span className="text-foreground font-bold">Jainil Patel</span></span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

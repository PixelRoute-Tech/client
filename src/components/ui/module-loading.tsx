import React, { useState, useEffect } from 'react';
import { Diamond } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ModuleLoadingProps {
    message?: string;
}

const ModuleLoading: React.FC<ModuleLoadingProps> = ({ message = "Initializing software..." }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    return 0;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 200);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md animate-in fade-in duration-500">
            <div className="relative group">
                {/* Glowing background behind logo */}
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-1000" />
                
                <div className="relative flex flex-col items-center gap-8">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center animate-bounce duration-[2000ms]">
                        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-4 border border-primary/20 shadow-2xl">
                            <Diamond className="w-12 h-12 text-primary animate-pulse" />
                        </div>
                        <h1 className="text-4xl font-light text-foreground tracking-widest flex items-center gap-2">
                           VERI<span className="font-bold text-primary">CORE</span>
                        </h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-[0.5em] mt-2">
                            Advanced Inspection Systems
                        </p>
                    </div>

                    {/* Progress Section */}
                    <div className="w-72 space-y-4">
                        <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-widest">
                            <span className="animate-pulse">{message}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-1 bg-primary/10" />
                        <div className="flex justify-center gap-1">
                           {[1, 2, 3].map((i) => (
                             <div 
                                key={i}
                                className="h-1 w-1 rounded-full bg-primary/40 animate-bounce"
                                style={{ animationDelay: `${i * 150}ms` }}
                             />
                           ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtext */}
            <div className="absolute bottom-12 text-[10px] text-muted-foreground uppercase tracking-[0.4em] opacity-40">
                Securely connecting to enterprise resources
            </div>
        </div>
    );
};

export default ModuleLoading;

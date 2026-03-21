'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Calendar, ExternalLink, Award, CheckCircle2, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { type Achievement } from '@/lib/api';
import { cn } from '@/lib/utils';

interface AchievementTimelineProps {
    achievements: Achievement[];
}

const AchievementTimeline = ({ achievements }: AchievementTimelineProps) => {
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

    // Group achievements into rows of 3 for desktop
    const rows: Achievement[][] = [];
    for (let i = 0; i < achievements.length; i += 3) {
        rows.push(achievements.slice(i, i + 3));
    }

    return (
        <div className="relative max-w-7xl mx-auto px-4 py-20">
            {/* Desktop Snake Timeline */}
            <div className="hidden lg:block space-y-24">
                {rows.map((row, rowIndex) => {
                    const isReverse = rowIndex % 2 !== 0;
                    
                    return (
                        <div key={rowIndex} className="relative">
                            <div 
                                className="grid grid-cols-3 gap-12" 
                                dir={isReverse ? "rtl" : "ltr"}
                            >
                                {row.map((achievement, colIndex) => {
                                    const actualIndex = rowIndex * 3 + colIndex;
                                    return (
                                        <div key={achievement._id} className="relative">
                                            <CompactTimelineCard 
                                                achievement={achievement} 
                                                index={actualIndex}
                                                onSelect={() => setSelectedAchievement(achievement)}
                                            />
                                            {/* Connecting Line (Horizontal) */}
                                            {colIndex < row.length - 1 && (
                                                <div className={cn(
                                                    "absolute top-1/2 -translate-y-1/2 w-12 h-0.5 border-t-2 border-dashed border-primary/30 z-0",
                                                    isReverse ? "-left-12" : "-right-12"
                                                )} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {/* Row Turn Connector (Vertical) */}
                            {rowIndex < rows.length - 1 && (
                                <div className={cn(
                                    "absolute -bottom-24 w-0.5 h-24 border-l-2 border-dashed border-primary/30",
                                    isReverse ? "left-12" : "right-12"
                                )} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mobile/Tablet Vertical Timeline (Simplified) */}
            <div className="lg:hidden relative">
                 <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
                 <div className="space-y-12">
                    {achievements.map((achievement, index) => (
                        <div key={achievement._id} className="relative pl-16">
                            <div className="absolute left-4 top-4 w-4 h-4 rounded-full bg-zinc-950 border-2 border-primary z-10" />
                            <CompactTimelineCard 
                                achievement={achievement} 
                                index={index}
                                onSelect={() => setSelectedAchievement(achievement)}
                            />
                        </div>
                    ))}
                 </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedAchievement && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedAchievement(null)}
                            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="relative w-full max-w-6xl bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(var(--primary-rgb),0.1)] border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col lg:flex-row max-h-[90vh]"
                        >
                            <button 
                                onClick={() => setSelectedAchievement(null)}
                                className="absolute top-8 right-8 z-50 p-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-primary transition-all shadow-lg"
                            >
                                <X size={24} />
                            </button>

                            {/* Modal Image Section */}
                            <div className="w-full lg:w-7/12 h-[300px] lg:h-auto bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden group">
                                {selectedAchievement.image ? (
                                    <img 
                                        src={selectedAchievement.image} 
                                        alt={selectedAchievement.title} 
                                        className="w-full h-full object-contain p-4 lg:p-12 transition-transform duration-1000 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-primary/10">
                                        <Award size={200} />
                                    </div>
                                )}
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-zinc-900/40 to-transparent lg:hidden" />
                            </div>

                            {/* Modal Info Section */}
                            <div className="flex-1 p-8 lg:p-16 overflow-y-auto custom-scrollbar flex flex-col">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                                        {selectedAchievement.type === 'award' ? <Trophy size={16} /> : <Medal size={16} />}
                                        {selectedAchievement.type}
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                                        <Calendar size={16} />
                                        {new Date(selectedAchievement.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </div>
                                </div>

                                <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-8 leading-[1.1] text-zinc-900 dark:text-white">
                                    {selectedAchievement.title}
                                </h2>

                                <div className="space-y-6 mb-12">
                                    <div className="flex items-start gap-4 p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center text-primary shadow-sm border border-zinc-100 dark:border-zinc-800">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-black">Issuing Organization</p>
                                            <p className="text-xl font-bold dark:text-zinc-200">{selectedAchievement.organization}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose prose-lg dark:prose-invert max-w-none mb-12 flex-grow">
                                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-lg">
                                        {selectedAchievement.description}
                                    </p>
                                </div>

                                <div className="pt-10 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6 mt-auto">
                                    <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">
                                        <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
                                        Official Credential ID Verified
                                    </div>
                                    <button 
                                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-[2rem] bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-sm font-black uppercase tracking-widest hover:bg-primary dark:hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-primary/10"
                                    >
                                        View Credential
                                        <ExternalLink size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CompactTimelineCard = ({ achievement, index, onSelect }: { achievement: Achievement; index: number; onSelect: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            onClick={onSelect}
            className="group cursor-pointer"
        >
            <div className="relative p-6 bg-white/5 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2rem] transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5">
                
                {/* Thumbnail */}
                {achievement.image && (
                    <div className="mb-4 rounded-xl overflow-hidden aspect-[16/10] bg-zinc-100 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800">
                        <img 
                            src={achievement.image} 
                            alt={achievement.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </div>
                )}

                <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">
                        <span>{new Date(achievement.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                        <div className={cn(
                            "w-2 h-2 rounded-full",
                            achievement.type === 'award' ? "bg-amber-500" : "bg-blue-500"
                        )} />
                    </div>
                    <h3 className="font-black tracking-tight text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {achievement.title}
                    </h3>
                    <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider line-clamp-1">
                        {achievement.organization}
                    </p>
                </div>

                {/* Hover Indicator */}
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Read Detail</span>
                </div>
            </div>
        </motion.div>
    );
};

export default AchievementTimeline;

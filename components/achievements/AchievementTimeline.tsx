'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Calendar, ExternalLink, Award, CheckCircle2, X } from 'lucide-react';
import { type Achievement } from '@/lib/api';
import { cn } from '@/lib/utils';

interface AchievementTimelineProps {
    achievements: Achievement[];
}

const AchievementTimeline = ({ achievements }: AchievementTimelineProps) => {
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

    return (
        <div className="relative max-w-5xl mx-auto px-2 md:px-4 py-12">
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent md:-translate-x-1/2" />

            <div className="space-y-12 md:space-y-16">
                {achievements.map((achievement, index) => (
                    <TimelineItem 
                        key={achievement._id} 
                        achievement={achievement} 
                        index={index} 
                        onSelect={() => setSelectedAchievement(achievement)}
                    />
                ))}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedAchievement && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedAchievement(null)}
                            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row max-h-[90vh]"
                        >
                            <button 
                                onClick={() => setSelectedAchievement(null)}
                                className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Modal Image Section */}
                            <div className="w-full md:w-5/12 h-64 md:h-auto bg-zinc-100 dark:bg-zinc-800 relative">
                                {selectedAchievement.image ? (
                                    <img 
                                        src={selectedAchievement.image} 
                                        alt={selectedAchievement.title} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-primary/20">
                                        <Award size={120} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                                <div className="absolute bottom-6 left-6 md:hidden">
                                     <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                                        {selectedAchievement.type === 'award' ? <Trophy size={14} /> : <Medal size={14} />}
                                        {selectedAchievement.type}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Info Section */}
                            <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
                                <div className="hidden md:flex items-center gap-3 mb-6">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                                        {selectedAchievement.type === 'award' ? <Trophy size={14} /> : <Medal size={14} />}
                                        {selectedAchievement.type}
                                    </div>
                                    <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                    <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                                        <Calendar size={14} />
                                        {new Date(selectedAchievement.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </div>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight">
                                    {selectedAchievement.title}
                                </h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 font-bold tracking-tight">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-primary">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 leading-none mb-1">Organization</p>
                                            <p className="text-lg">{selectedAchievement.organization}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 font-bold tracking-tight md:hidden">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 leading-none mb-1">Date Issued</p>
                                            <p className="text-lg">{new Date(selectedAchievement.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-base">
                                        {selectedAchievement.description}
                                    </p>
                                </div>

                                <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                        Verified System Record
                                    </div>
                                    <button 
                                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform"
                                    >
                                        View Credential
                                        <ExternalLink size={14} />
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

const TimelineItem = ({ achievement, index, onSelect }: { achievement: Achievement; index: number; onSelect: () => void }) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={cn(
                "relative flex flex-col md:flex-row items-center",
                isEven ? "md:flex-row-reverse" : "md:flex-row"
            )}
        >
            {/* Timeline Node */}
            <div className="absolute left-6 md:left-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-950 border-4 border-primary/20 flex items-center justify-center transform -translate-x-1/2 z-20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse" />
            </div>

            {/* Content Card Area */}
            <div className={cn(
                "w-full md:w-1/2 pl-12 md:pl-0",
                isEven ? "md:pr-12 lg:pr-16" : "md:pl-12 lg:pl-16"
            )}>
                <div className="group relative" onClick={onSelect}>
                    {/* Glass Card */}
                    <div className="relative cursor-pointer overflow-hidden bg-white/5 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 group-hover:-translate-y-2">
                        
                        {/* Background Decoration */}
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
                        
                        <div className="relative z-10">
                            {/* Header: Date & Type */}
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                    {achievement.type === 'award' ? (
                                        <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" />
                                    ) : (
                                        <Medal className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" />
                                    )}
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary capitalize">
                                        {achievement.type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 opacity-50" />
                                    {new Date(achievement.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </div>
                            </div>

                            {/* Image if available */}
                            {achievement.image && (
                                <div className="mb-4 md:mb-6 rounded-xl md:rounded-2xl overflow-hidden aspect-video border border-zinc-100 dark:border-zinc-800">
                                    <img 
                                        src={achievement.image} 
                                        alt={achievement.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            )}

                            {/* Main Content */}
                            <h3 className="text-xl md:text-2xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                {achievement.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-4 text-zinc-500 dark:text-zinc-400 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary/60" />
                                <span className="text-xs md:text-sm tracking-tight">{achievement.organization}</span>
                            </div>
                            
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 line-clamp-2 group-hover:line-clamp-3 transition-all duration-500">
                                {achievement.description}
                            </p>

                            {/* Footer/Action */}
                            <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">Click for details</span>
                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <ExternalLink size={14} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer for the other side */}
            <div className="hidden md:block w-1/2" />
        </motion.div>
    );
};

export default AchievementTimeline;

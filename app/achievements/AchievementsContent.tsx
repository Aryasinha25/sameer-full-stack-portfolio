'use client';

import React, { useState, useMemo } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import AchievementTimeline from '@/components/achievements/AchievementTimeline';
import { Search, Trophy, Medal, Star, Award, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AchievementsContent() {
    const { achievements, loading, error } = usePortfolio();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'award' | 'certification'>('all');

    const filteredAchievements = useMemo(() => {
        return achievements.filter(ach => {
            const matchesSearch = ach.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ach.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ach.organization.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === 'all' || ach.type === filterType;
            return matchesSearch && matchesType;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [achievements, searchQuery, filterType]);

    const stats = useMemo(() => [
        { label: 'Total Wins', value: achievements.length, icon: Trophy },
        { label: 'Featured', value: Math.ceil(achievements.length * 0.4), icon: Star },
        { label: 'Recent', value: achievements.filter(a => new Date(a.date).getFullYear() === new Date().getFullYear()).length, icon: TrendingUp },
    ], [achievements]);

    return (
        <div className="pt-32 pb-24 px-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6 font-seona text-zinc-900 dark:text-white">
                            mile<span className="text-primary">stones.</span>
                        </h1>
                        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                            A curated timeline of professional milestones, academic excellence, and technical certifications.
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                                    <p className="text-3xl font-black">{stat.value}</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-primary shadow-sm">
                                    <stat.icon size={24} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Toolbar */}
                <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 p-4 rounded-[2.5rem] bg-zinc-100/50 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search milestones..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-12 pr-6 bg-white dark:bg-zinc-950 rounded-full border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-white/50 dark:bg-zinc-950/50 rounded-full border border-zinc-200/50 dark:border-zinc-800/50">
                        {['all', 'award', 'certification'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type as any)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                    filterType === type 
                                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                        : "hover:bg-zinc-200 dark:hover:bg-zinc-800 text-muted-foreground"
                                )}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4">
                        <span className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-primary'}`} />
                            {loading ? 'Syncing...' : 'Live Stream'}
                        </span>
                        <div className="w-1 h-4 bg-zinc-200 dark:bg-zinc-800" />
                        <span className="flex items-center gap-2">
                             {filteredAchievements.length} Displayed
                        </span>
                    </div>
                </div>

                {/* Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-80 bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] animate-pulse" />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="timeline"
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <AchievementTimeline achievements={filteredAchievements} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {!loading && filteredAchievements.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 rounded-[3.5rem] border-2 border-dashed border-zinc-100 dark:border-zinc-800"
                    >
                        <Award className="mx-auto text-muted-foreground/20 mb-6" size={64} />
                        <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground/40">No milestones found</h3>
                        <p className="text-sm text-muted-foreground mt-2">Adjust your search to find specific achievement records.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

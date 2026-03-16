'use client';

import React, { useState, useEffect } from 'react';
import { getPublicFolderBySlug, NoteFolder, Note } from '@/lib/api';
import StudyFile from '@/components/study/StudyFile';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, FolderOpen, Info, AlertCircle, FileText } from 'lucide-react';

export default function TopicPageContent({ params, initialFolder }: { params: { topicSlug: string }, initialFolder?: NoteFolder | null }) {
    const { topicSlug } = params;
    const [folder, setFolder] = useState<NoteFolder | null>(initialFolder || null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFolderData = async () => {
            try {
                setIsLoading(true);
                const response = await getPublicFolderBySlug(topicSlug);
                if (response.success) {
                    setFolder(response.data.folder);
                    setNotes([...response.data.notes].reverse());
                } else {
                    setError('Folder not found or private');
                }
            } catch (err) {
                console.error('Error fetching folder data:', err);
                setError('Failed to connect to the knowledge base.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFolderData();
    }, [topicSlug]);

    if (isLoading) {
        return (
            <div className="w-full min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Syncing Archive...</p>
                </div>
            </div>
        );
    }

    if (error || !folder) {
        return (
            <div className="w-full min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="mx-auto text-red-500 mb-6" size={48} />
                    <h2 className="text-2xl font-black mb-2">Access Denied</h2>
                    <p className="text-muted-foreground text-sm mb-8">{error || 'This topic is currently private or does not exist.'}</p>
                    <Link 
                        href="/study"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                        <ChevronLeft size={16} /> Return to Library
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex items-center gap-4 text-[10px] font-black tracking-widest text-muted-foreground/60 transition-colors">
                    <Link
                        href="/study"
                        className="flex items-center gap-1 hover:text-primary transition-colors group"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Library
                    </Link>
                    <span className="opacity-30">/</span>
                    <span className="text-foreground tracking-tight">{folder.name}</span>
                </div>

                <div className="mb-16 flex flex-col md:flex-row items-baseline justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/50 pb-8">
                    <div className="space-y-2 max-w-2xl text-left">
                        <h1 className="text-4xl md:text-6xl font-black lowercase tracking-tighter">
                            {folder.name}<span className="text-primary">.</span>
                        </h1>
                        <p className="text-muted-foreground text-sm tracking-[0.05em] font-medium opacity-80 leading-relaxed italic">
                            {folder.description || 'Neural Repository Asset'}
                        </p>
                    </div>

                    <div className="w-full md:w-auto">
                        <div className="p-8 rounded-[2.5rem] bg-zinc-950/20 backdrop-blur-2xl border border-white/5 text-center min-w-[140px] shadow-2xl group transition-all duration-300 hover:border-primary/20">
                            <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 group-hover:text-primary transition-colors mb-2">Files</span>
                            <span className="text-4xl font-black tracking-tighter">{notes.length}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3 text-muted-foreground/40">
                            <Info size={14} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Select a module to explore</span>
                        </div>
                        <div className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/20">
                            Archive Updated: {new Date(folder.updatedAt).toLocaleDateString()}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {notes.length === 0 ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/20 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800"
                            >
                                <FileText className="mx-auto text-muted-foreground/20 mb-4" size={48} />
                                <p className="text-muted-foreground font-medium">No research notes found in this topic yet.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="grid"
                                layout
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8"
                            >
                                {notes.map((note, index) => (
                                    <motion.div
                                        key={note._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <StudyFile
                                            title={note.title}
                                            description={note.description}
                                            topicSlug={folder.slug}
                                            chapterSlug={note.slug}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

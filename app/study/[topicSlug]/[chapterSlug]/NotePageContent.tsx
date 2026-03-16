'use client';

import React, { useState, useEffect } from 'react';
import { getPublicFolderBySlug, getPublicNoteBySlug, NoteFolder, Note as APINote } from '@/lib/api';
import { Chapter, StudyMaterial } from '@/data/study-materials';
import EbookReader from '@/components/study/EbookReader';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, AlertCircle, ChevronLeft, Loader2 } from 'lucide-react';

export default function NotePageContent({ params, initialNote, initialFolder }: { params: { topicSlug: string; chapterSlug: string }, initialNote?: APINote | null, initialFolder?: NoteFolder | null }) {
    const { topicSlug, chapterSlug } = params;
    const [isLiked, setIsLiked] = useState(false);
    
    const [folder, setFolder] = useState<NoteFolder | null>(initialFolder || null);
    const [currentNote, setCurrentNote] = useState<APINote | null>(initialNote || null);
    const [allNotesInFolder, setAllNotesInFolder] = useState<APINote[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoading(true);
                // 1. Fetch the specific note content
                const noteRes = await getPublicNoteBySlug(chapterSlug);
                
                // 2. Fetch the folder and its other notes for the navigation sidebar
                const folderRes = await getPublicFolderBySlug(topicSlug);

                if (noteRes.success && folderRes.success) {
                    setCurrentNote(noteRes.data.note);
                    setFolder(folderRes.data.folder);
                    setAllNotesInFolder([...folderRes.data.notes].reverse());
                } else {
                    setError('Content not found or inaccessible.');
                }
            } catch (err) {
                console.error('Error fetching note data:', err);
                setError('Failed to connect to the knowledge archive.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [topicSlug, chapterSlug]);

    // Map API types to EbookReader types
    const mappedStudyMaterial: StudyMaterial | null = folder ? {
        id: folder._id,
        slug: folder.slug,
        topic: folder.name,
        title: folder.name,
        image: '', // Use a default or icon
        videoUrl: '',
        githubLink: '',
        rating: 5.0,
        description: folder.description,
        chapters: allNotesInFolder.map(n => ({
            id: n._id,
            slug: n.slug,
            title: n.title,
            content: n.content_html || n.content // Prefer HTML for Tiptap
        }))
    } : null;

    const mappedActiveChapter: Chapter | null = currentNote ? {
        id: currentNote._id,
        slug: currentNote.slug,
        title: currentNote.title,
        content: currentNote.content_html || currentNote.content
    } : null;

    const handleSetActiveChapter = (chapter: Chapter) => {
        // This will trigger a navigation in a real app, 
        // but EbookReader handles it internally for state too.
        // For dynamic routing, we should navigate to the new slug.
        window.location.href = `/study/${topicSlug}/${chapter.slug}`;
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h2 className="text-xl font-black uppercase tracking-widest text-muted-foreground animate-bounce">Accessing Neural Archive...</h2>
            </div>
        );
    }

    if (error || !mappedStudyMaterial || !mappedActiveChapter) {
        return (
            <div className="w-full min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="mx-auto text-red-500 mb-6" size={48} />
                    <h2 className="text-2xl font-black mb-2">Archive Corrupted</h2>
                    <p className="text-muted-foreground text-sm mb-8">{error || 'The requested research note could not be retrieved.'}</p>
                    <Link 
                        href={`/study/${topicSlug}`}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                        <ChevronLeft size={16} /> Return to Topic
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-background">
            <AnimatePresence mode="wait">
                <EbookReader
                    key={mappedActiveChapter.id}
                    item={mappedStudyMaterial}
                    activeChapter={mappedActiveChapter}
                    setActiveChapter={handleSetActiveChapter}
                    isLiked={isLiked}
                    setIsLiked={setIsLiked}
                />
            </AnimatePresence>

            {/* Related Research Section */}
            <div className="max-w-4xl mx-auto px-6 py-20 border-t border-white/10">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 font-seona not-italic">
                    Expand your <span className="text-primary italic">knowledge</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <Link
                        href={`/study/${topicSlug}`}
                        className="group p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-primary/40 transition-all flex items-center justify-between"
                    >
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Parent Topic</span>
                            <h4 className="text-3xl font-black lowercase tracking-tighter group-hover:text-primary transition-colors">{folder?.name}.</h4>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                            <ArrowRight className="w-6 h-6" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

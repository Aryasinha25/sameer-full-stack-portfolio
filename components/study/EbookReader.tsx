'use client';

import React, { useEffect } from 'react';
import { Chapter, StudyMaterial } from '@/data/study-materials';
import { useParams } from 'next/navigation';
import { useHeader } from '@/context/HeaderContext';
import { Bookmark as BookmarkIcon, Download, Share2 } from 'lucide-react';
import { StudyNavigation } from './StudyNavigation';
import { NoteContent } from './NoteContent';
import { cn } from '@/lib/utils';
 
interface TOCItem {
    id: string;
    text: string;
    level: number;
    subItems: TOCItem[];
}

interface EbookReaderProps {
    item: StudyMaterial;
    activeChapter: Chapter | null;
    setActiveChapter: (chapter: Chapter) => void;
    isLiked: boolean;
    setIsLiked: (liked: boolean) => void;
}

/**
 * [Hierarchy Level: UI Wrapper]
 * A simplified wrapper that arranges the Sidebar and Note Content.
 * Uses natural browser scrolling for the main content area.
 */
export default function EbookReader({
    item,
    activeChapter,
    isLiked,
    setIsLiked
}: EbookReaderProps) {
    const { setTitle, setActions, clearHeader } = useHeader();
    const params = useParams();
    const topicSlug = params.topicSlug as string;

    // Stable Sync with Global Header
    useEffect(() => {
        if (!activeChapter) return;

        // setTitle(activeChapter.title);

        const actions = (
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2.5 rounded-xl border border-white/5 transition-all duration-300 ${isLiked ? 'bg-primary/20 text-primary border-primary/20' : 'hover:bg-white/10'
                        }`}
                >
                    <BookmarkIcon size={18} fill={isLiked ? "currentColor" : "none"} />
                </button>
                <button className="p-2.5 rounded-xl border border-white/5 hover:bg-white/10 transition-all duration-300">
                    <Download size={18} />
                </button>
                <button className="p-2.5 rounded-xl border border-white/5 hover:bg-white/10 transition-all duration-300">
                    <Share2 size={18} />
                </button>
            </div>
        );

        setActions(actions);
        return () => clearHeader();
    }, [activeChapter?.id, isLiked, setTitle, setActions, clearHeader, setIsLiked]);
 
    const containerHeight = "h-[calc(100vh-10rem)]";
 
    // Helper to extract TOC items and inject IDs
    const processContent = (html: string): { toc: TOCItem[], processedHtml: string } => {
        const toc: TOCItem[] = [];
        let processedHtml = html;
        const headingRegex = /<h([1-2])([^>]*)>(.*?)<\/h\1>/gi;
        let match;
 
        let currentH1: TOCItem | null = null;
        let matches: { full: string, level: number, attrs: string, text: string }[] = [];
        
        // Collect all matches first to avoid regex reset issues during replacement
        while ((match = headingRegex.exec(html)) !== null) {
            matches.push({
                full: match[0],
                level: parseInt(match[1]),
                attrs: match[2],
                text: match[3]
            });
        }

        matches.forEach((m, index) => {
            const idMatch = m.attrs.match(/id="([^"]*)"/i);
            const textContent = m.text.replace(/<\/?[^>]+(>|$)/g, "");
            const id = idMatch ? idMatch[1] : `heading-${index}-${textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`;

            const item: TOCItem = { id, text: textContent, level: m.level, subItems: [] };

            if (m.level === 1) {
                toc.push(item);
                currentH1 = item;
            } else if (m.level === 2 && currentH1) {
                currentH1.subItems.push(item);
            }

            // Inject ID into HTML if not present
            if (!idMatch) {
                const newTag = `<h${m.level} id="${id}" ${m.attrs}>${m.text}</h${m.level}>`;
                processedHtml = processedHtml.replace(m.full, newTag);
            }
        });

        return { toc, processedHtml };
    };
 
    const { toc, processedHtml } = activeChapter 
        ? processContent(activeChapter.content) 
        : { toc: [], processedHtml: '' };

    if (!activeChapter) return null;

    return (
        <div className="w-full bg-background selection:bg-primary/30 pt-28 pb-12 px-6 lg:px-12">
            {/* Minimal Background */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-background" />
 
            <div className="flex w-full gap-8 items-start relative">
                {/* 1. Sidebar Pane (Fixed Anchor) */}
                <aside className="hidden lg:block w-[300px] shrink-0">
                    <div className={cn(
                        "fixed w-[300px] top-28 z-20",
                        containerHeight
                    )}>
                        <div className="h-full rounded-3xl border border-white/5 bg-zinc-950/20 backdrop-blur-3xl overflow-hidden shadow-2xl">
                            <StudyNavigation
                                item={item}
                                topicSlug={topicSlug}
                                activeChapter={activeChapter}
                                toc={toc}
                            />
                        </div>
                    </div>
                </aside>
 
                {/* 2. Content Pane (Long Note) */}
                <main className="flex-1 min-w-0 rounded-3xl border border-white/5 bg-zinc-950/10 backdrop-blur-3xl shadow-2xl relative notebook-background min-h-screen">
                    <NoteContent
                        title={activeChapter.title}
                        content={processedHtml}
                        topic={item.topic}
                        id={activeChapter.id}
                        estimatedTime={item.estimatedTime || '10m'}
                    />
                </main>
            </div>
        </div>
    );
}

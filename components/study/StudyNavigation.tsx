'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ListOrdered, CheckCircle2, Bookmark, ExternalLink } from 'lucide-react';
import { Chapter, StudyMaterial } from '@/data/study-materials';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Hash } from 'lucide-react';
 
interface TOCItem {
    id: string;
    text: string;
    level: number;
    subItems: TOCItem[];
}

interface StudyNavigationProps {
    item: StudyMaterial;
    activeChapter: Chapter | null;
    toggleSidebar?: () => void;
    topicSlug: string;
    toc?: TOCItem[];
}

export function StudyNavigation({
    item,
    activeChapter,
    topicSlug,
    toc = []
}: StudyNavigationProps) {
    const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());
 
    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedIds(newSet);
    };
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full flex flex-col h-full bg-transparent"
        >
            {/* Sidebar Header */}
            <div className="px-8 py-10 border-b border-white/5 bg-transparent">
                <h3 className="text-[10px] font-black tracking-[0.4em] flex items-center gap-3 text-primary mb-6">
                    <ListOrdered size={14} /> curriculum archive
                </h3>

                <div className="space-y-1">
                    <h4 className="text-lg font-black tracking-tighter text-foreground truncate">
                        {item.topic}
                    </h4>
                    {/* <div className="flex items-center gap-2 opacity-40">
                        <span className="text-[10px] font-bold tracking-widest">{item.chapters.length} investigation units</span>
                    </div> */}
                </div>
            </div>

            {/* Navigation List */}
            <ScrollArea className="flex-1 w-full min-h-0">
                <div className="px-4 py-6 space-y-8">
                    {/* Chapter Navigation */}
                    {/* <div className="space-y-1">
                        <div className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">investigation units</div>
                        <div className="space-y-1">
                            {item.chapters.map((chapter) => (
                                <Link
                                    key={chapter.id}
                                    href={`/study/${topicSlug}/${chapter.slug}`}
                                    className={cn(
                                        "w-full text-left px-4 py-3 rounded-xl text-[11px] font-bold flex items-center justify-between group transition-all duration-300 tracking-tight",
                                        activeChapter?.id === chapter.id 
                                            ? "bg-primary/10 text-primary border border-primary/10" 
                                            : "text-muted-foreground/60 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                            activeChapter?.id === chapter.id ? "bg-primary scale-100" : "bg-white/10 scale-50 group-hover:scale-100"
                                        )} />
                                        <span className="line-clamp-1">{chapter.title}</span>
                                    </div>
                                    {activeChapter?.id === chapter.id && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div> */}

                    {/* Dynamic Table of Contents */}
                    {toc.length > 0 && (
                        <div className="space-y-1 border-t border-white/5 pt-8">
                            <div className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 sticky top-0 bg-transparent backdrop-blur-sm py-2 z-10">in this note</div>
                            
                            <div className="space-y-1">
                                {toc.map((h1) => (
                                    <div key={h1.id} className="space-y-1">
                                        <button
                                            onClick={() => {
                                                toggleExpand(h1.id);
                                                const element = document.getElementById(h1.id);
                                                if (element) {
                                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }
                                            }}
                                            className="w-full text-left px-4 py-3 rounded-xl text-[11px] font-black flex items-center justify-between group hover:bg-white/5 text-muted-foreground/60 hover:text-white transition-all duration-300 tracking-tight"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Hash size={12} className="text-primary/40 group-hover:text-primary transition-colors" />
                                                <span className="line-clamp-1 text-xs opacity-80 group-hover:opacity-100">{h1.text}</span>
                                            </div>
                                            {h1.subItems.length > 0 && (
                                                <div className="opacity-20 group-hover:opacity-60 transition-opacity">
                                                    {expandedIds.has(h1.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                </div>
                                            )}
                                        </button>
 
                                        {/* Nested H2s */}
                                        {h1.subItems.length > 0 && expandedIds.has(h1.id) && (
                                            <div className="ml-8 border-l border-white/5 space-y-1 my-1">
                                                {h1.subItems.map((h2) => (
                                                    <button
                                                        key={h2.id}
                                                        className="w-full text-left px-4 py-2 rounded-lg text-[10px] font-bold text-muted-foreground/40 hover:text-primary hover:bg-primary/5 transition-all duration-300 truncate"
                                                        onClick={() => {
                                                            const element = document.getElementById(h2.id);
                                                            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                        }}
                                                    >
                                                        {h2.text}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </motion.div>
    );
}

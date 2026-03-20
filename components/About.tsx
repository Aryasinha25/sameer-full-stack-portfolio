'use client';

import React, { memo, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { STYLES } from '@/lib/constants/styles';
import { cn } from '@/lib/utils';
import { GitHubCalendar } from 'react-github-calendar';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import {
    Briefcase,
    Award,
    Users,
    Zap,
    Code2,
    Flame,
    Clock,
    Globe2,
    Music2,
    Linkedin,
    MapPin,
    Trophy,
    Loader2
} from 'lucide-react';
import Image from 'next/image';
import { PERSONAL_INFO } from '@/lib/constants/personalInfo';

const BentoStatCard = memo(({ value, label, colorClass, icon: Icon }: { value: string, label: string, colorClass: string, icon: React.ElementType }) => (
    <Card className={cn("p-6 flex flex-col justify-center items-center text-center space-y-2 border-none rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-300 group", colorClass)}>
        <Icon className="w-4 h-4 opacity-40 group-hover:scale-110 group-hover:opacity-100 transition-all" />
        <div className="flex flex-col">
            <span className="text-4xl font-black group-hover:scale-105 transition-transform tracking-tight not-italic">{value}</span>
            <span className="opacity-60 font-black uppercase text-[9px] tracking-[0.2em] font-seona not-italic">{label}</span>
        </div>
    </Card>
));

const LiveClock = memo(() => {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const istTime = time ? new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })) : null;

    return (
        <div className="flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-foreground tabular-nums not-italic" suppressHydrationWarning>
                {istTime ? istTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
            </span>
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-muted-foreground/30 mt-1 sm:mt-2 font-seona not-italic">IST • INDIA</span>
        </div>
    );
});

type GitHubData = { public_repos: number; followers: number; public_gists: number; };

const useGitHubStats = (username: string) => {
    const [data, setData] = useState<GitHubData | null>(null);
    useEffect(() => {
        fetch(`https://api.github.com/users/${username}`)
            .then(r => r.json())
            .then(setData)
            .catch(() => null);
    }, [username]);
    return data;
};

const GitHubTile = memo(({ mounted, resolvedTheme }: { mounted: boolean; resolvedTheme: string | undefined }) => {
    const stats = useGitHubStats('sameer-bagul');

    return (
        <Card className="px-2 py-4 bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl h-full flex flex-col justify-between overflow-hidden relative">
            {/* Header row */}
            <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Contributions
                </h3>
                {/* Mini stats */}
                {stats && (
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                            <span className="text-[11px] font-black text-foreground tabular-nums">{stats.public_repos}</span>
                            <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/30">Repos</span>
                        </div>
                        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />
                        <div className="flex flex-col items-center">
                            <span className="text-[11px] font-black text-foreground tabular-nums">{stats.followers}</span>
                            <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/30">Followers</span>
                        </div>
                        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />
                        <div className="flex flex-col items-center">
                            <span className="text-[11px] font-black text-foreground tabular-nums">{stats.public_gists}</span>
                            <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/30">Gists</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Calendar — natural fit, clipped */}
            <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
                {mounted ? (
                    <GitHubCalendar
                        username="sameer-bagul"
                        fontSize={10}
                        blockSize={9}
                        blockMargin={3}
                        colorScheme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                        theme={{
                            light: ['#f4f4f5', '#22c55e'],
                            dark: ['#18181b', '#22c55e'],
                        }}
                    />
                ) : (
                    <div className="w-full h-[120px] animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-[10px] text-muted-foreground/30 font-black uppercase tracking-widest">
                        Syncing Graph...
                    </div>
                )}
            </div>
        </Card>
    );
});

export default function About() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="py-24 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <section className={cn(STYLES.section, "overflow-hidden w-full")}>
            <div className={cn(STYLES.container, "px-4 sm:px-6")}>

                {/* Mobile-Only Simplified Layout */}
                <div className="md:hidden space-y-4">
                    {/* Mobile: Image Tile - Square and Compact */}
                    <div className="relative group aspect-square w-full max-w-[350px] mx-auto">
                        <div className="absolute inset-0 bg-primary/10 rounded-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700" />
                        <div className="w-full h-full bg-zinc-200 dark:bg-zinc-900 rounded-2xl relative z-10 flex items-center justify-center border-2 border-white/50 dark:border-zinc-800 shadow-xl overflow-hidden">
                            <Image
                                src="/about.png"
                                alt={PERSONAL_INFO.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" />
                        </div>
                    </div>

                    {/* Mobile: About Content */}
                    <div className="flex flex-col space-y-4 p-6 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
                        <h2 className="text-3xl font-black tracking-tighter leading-tight text-foreground font-seona not-italic">
                            Building Digital Excellence
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {PERSONAL_INFO.bio}
                        </p>

                        {/* Mobile: Key Highlights */}
                        <div className="grid grid-cols-2 gap-3 pt-4">
                            <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl">
                                <div className="text-2xl font-black text-primary font-seona">5+</div>
                                <div className="text-[9px] uppercase font-black tracking-wider text-muted-foreground/60">Achievements</div>
                            </div>
                            <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl">
                                <div className="text-2xl font-black text-primary font-seona">100+</div>
                                <div className="text-[9px] uppercase font-black tracking-wider text-muted-foreground/60">Projects</div>
                            </div>
                            <Link href={PERSONAL_INFO.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                                <div className="text-2xl font-black text-primary font-seona">3.2k</div>
                                <div className="text-[9px] uppercase font-black tracking-wider text-muted-foreground/60">Network</div>
                            </Link>
                            <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl">
                                <div className="text-2xl font-black text-primary font-seona">24/7</div>
                                <div className="text-[9px] uppercase font-black tracking-wider text-muted-foreground/60">Available</div>
                            </div>
                        </div>

                        {/* Mobile: Tech Stack */}
                        <div className="pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
                            <Link href="https://linktr.ee/sameerbagul2004" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between mb-3 group cursor-pointer">
                                <h3 className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 group-hover:text-primary transition-colors">Core Stack</h3>
                                <div className="text-[8px] font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">View All →</div>
                            </Link>
                            <div className="flex flex-wrap gap-2">
                                {['TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'AI/ML'].map((tech) => (
                                    <span key={tech} className="px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-wider text-foreground">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Mobile: Location & Status */}
                        <div className="flex items-center justify-between pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-primary" />
                                <span className="text-sm font-bold text-foreground">{PERSONAL_INFO.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-bold text-foreground">Available</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop-Only: Full Bento Grid */}
                <div className="hidden md:grid md:grid-cols-12 gap-2 md:grid-rows-6 md:h-[800px]">

                    {/* div1: About Text */}
                    <div className="md:col-span-8 md:row-span-2 flex flex-col justify-center space-y-4 p-10 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50">
                        <h2 className={cn(STYLES.heading, "text-left md:text-6xl")}>Crafting digital bridges</h2>
                        <p className={cn(STYLES.subheading, "text-left leading-relaxed opacity-80")}>
                            {PERSONAL_INFO.bio}
                        </p>
                    </div>

                    <div className="md:col-span-4 md:row-span-4 md:col-start-9 md:row-start-1 relative group">
                        <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-3 group-hover:rotate-0 transition-transform duration-700" />
                        <div className="w-full h-full bg-zinc-200 dark:bg-zinc-900 rounded-3xl relative z-10 flex items-center justify-center border-2 border-white/50 dark:border-zinc-800 shadow-xl overflow-hidden">
                            <Image
                                src="/about.png"
                                alt={PERSONAL_INFO.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" />
                        </div>
                    </div>

                    {/* div18: Stat 1 (Projects) */}
                    <div className="md:col-span-2 md:col-start-1 md:row-start-3">
                        <BentoStatCard
                            value="100+"
                            label="Projects"
                            icon={Briefcase}
                            colorClass="bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 h-full !p-4"
                        />
                    </div>

                    {/* div16: Stat 2 (Years) */}
                    <div className="md:col-span-2 md:row-span-2 md:col-start-3 md:row-start-3">
                        <BentoStatCard
                            value="5+"
                            label="Achievements"
                            icon={Trophy}
                            colorClass="bg-purple-500/10 dark:bg-purple-500/20 text-purple-500 h-full"
                        />
                    </div>

                    {/* div17: Swapped -> Stack Highlights */}
                    <div className="md:row-span-2 md:col-start-5 md:row-start-3">
                        <Link href="https://linktr.ee/sameerbagul2004" target="_blank" rel="noopener noreferrer" className="block h-full group">
                            <Card className="p-4 bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl h-full flex flex-col justify-between group transition-all duration-300 hover:border-emerald-500/30 border border-transparent">
                                <div className="flex justify-between items-start">
                                    <Code2 className="w-4 h-4 text-emerald-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-[7px] font-black uppercase tracking-tighter text-muted-foreground/30 group-hover:text-emerald-500 transition-colors">Stack</span>
                                </div>
                                <div className="flex flex-col gap-2 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 mt-2">
                                    <div className="w-full h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-[8px] font-bold group-hover:bg-emerald-500/10 transition-colors">TS</div>
                                    <div className="w-full h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-[8px] font-bold group-hover:bg-emerald-500/10 transition-colors">RE</div>
                                    <div className="w-full h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-[8px] font-bold group-hover:bg-emerald-500/10 transition-colors">NX</div>
                                    <div className="w-full h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-[8px] font-bold group-hover:bg-emerald-500/10 transition-colors">ND</div>
                                </div>
                            </Card>
                        </Link>
                    </div>

                    {/* div11: Timezone & Live Clock - Vertical Orientaton */}
                    <div className="md:row-span-4 md:col-start-6 md:row-start-3">
                        <Card className="p-6 bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl flex flex-col items-center justify-center gap-6 group h-full relative overflow-hidden text-center">
                            <div className="bg-orange-500/10 p-3 rounded-full group-hover:scale-110 transition-transform mb-auto">
                                <Clock className="w-5 h-5 text-orange-500" />
                            </div>

                            <div className="flex flex-row items-center justify-center origin-center -rotate-90 whitespace-nowrap gap-4 min-w-[300px]">
                                <span className="text-xl font-black tracking-[0.3em] text-foreground uppercase opacity-10">TIMEZONE</span>
                                <span className="text-foreground opacity-20 text-xl">·</span>
                                <LiveClock />
                            </div>

                            <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-1 h-1 shadow-[0_0_10px_2px_rgba(249,115,22,0.5)] bg-orange-500 rounded-full animate-pulse" />
                            </div>
                        </Card>
                    </div>

                    {/* div8: Stat 3 (Network) with LinkedIn */}
                    <Link href={PERSONAL_INFO.socials.linkedin} target="_blank" rel="noopener noreferrer" className="md:col-span-2 md:col-start-7 md:row-start-3 cursor-pointer">
                        <BentoStatCard
                            value="3.2k"
                            label="Connections"
                            icon={Linkedin}
                            colorClass="bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 h-full !p-4"
                        />
                    </Link>

                    {/* div22: Swapped -> Working Globally */}
                    <div className="md:col-span-2 md:col-start-1 md:row-start-4">
                        <Card className="p-4 bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl h-full flex flex-col justify-between group overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex justify-between items-start relative z-10 text-[7px] font-black uppercase tracking-widest text-muted-foreground/30">
                                <span>Location</span>
                                <Globe2 className="w-3 h-3 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="relative z-10">
                                <span className="text-[13px] font-black block tracking-tighter text-foreground uppercase group-hover:translate-x-1 transition-transform font-seona not-italic">{PERSONAL_INFO.location}</span>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mt-1 not-italic">BASED IN INDIA</p>
                            </div>
                        </Card>
                    </div>

                    {/* div9: Filled Placeholder 2 -> Current Focus */}
                    <div className="md:col-span-2 md:col-start-7 md:row-start-4">
                        <Card className="p-4 bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl h-full flex flex-col justify-between group overflow-hidden relative">
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-150 transition-transform duration-700">
                                <Flame className="w-16 h-16 text-orange-500" />
                            </div>
                            <div className="relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/60 mb-2 block not-italic">Focus</span>
                                <h4 className="text-[13px] font-black uppercase tracking-tight leading-tight group-hover:translate-x-1 transition-transform font-seona not-italic">Scalable<br />Systems</h4>
                            </div>
                            <div className="relative z-10 w-4 h-4 bg-orange-500/20 rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                            </div>
                        </Card>
                    </div>

                    {/* div4: Spotify Direct Embed */}
                    <div className="md:col-span-3 md:row-span-2 md:col-start-1 md:row-start-5">
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex items-center justify-center bg-[#000000] dark:bg-[#000000] border border-zinc-200/50 dark:border-zinc-800/50 p-4">
                            <iframe
                                data-testid="embed-iframe"
                                style={{ borderRadius: '12px' }}
                                src="https://open.spotify.com/embed/track/7aUuoq4oMfLxaLa5GVUDHi?utm_source=generator"
                                width="100%"
                                height="152"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>

                    {/* div26: Stat 4 (Availability) */}
                    <div className="md:col-span-2 md:row-span-2 md:col-start-4 md:row-start-5">
                        <BentoStatCard
                            value="24/7"
                            label="Always On"
                            icon={Zap}
                            colorClass="bg-orange-500/10 dark:bg-orange-500/20 text-orange-500 h-full shadow-sm"
                        />
                    </div>

                    {/* div25: GitHub Contributions */}
                    <div className="md:col-span-6 md:row-span-2 md:col-start-7 md:row-start-5">
                        <GitHubTile mounted={mounted} resolvedTheme={resolvedTheme} />
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </section>
    );
}

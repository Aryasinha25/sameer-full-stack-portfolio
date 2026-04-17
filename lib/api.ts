import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sameeradminapi.azurewebsites.net/api';

const api = axios.create({
    baseURL: API_URL,
});

export interface Blog {
    _id: string;
    title: string;
    shortDescription: string;
    longContent: string;
    coverImage: string;
    category: string;
    author: string;
    readingTime: string;
    tags: string[];
    githubLink: string;
    blogLink: string;
    publishedAt: string;
    isPublished: boolean;
}

export interface Project {
    _id: string;
    title: string;
    slug?: string;
    shortDescription: string;
    description: string;
    tags: string[];
    techStack: string[];
    category: string;
    isFeatured: boolean;
    image: string;
    projectDate?: string;
    createdAt?: string;
    videoUrl: string;
    githubUrl: string;
    liveUrl: string;
    contributors: string[];
    features: string[];
}

export interface Skill {
    _id: string;
    name: string;
    icon: string;
    category?: string;
    row?: number;
}

export interface Experience {
    _id: string;
    id: string; // for compatibility
    role: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    duration: string;
    current: boolean;
    bullets: string[];
    techStack: string[];
}

export interface Testimonial {
    _id: string;
    name: string;
    role: string;
    company: string;
    content: string;
    avatar: string;
}

export interface Achievement {
    _id: string;
    title: string;
    organization: string;
    description: string;
    date: string;
    image?: string;
    type: 'award' | 'certification';
}



export const getBlogs = async (): Promise<Blog[]> => {
    const response = await api.get('/blog');
    return response.data;
};

export const getProjects = async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
};

export const getProjectBySlug = async (slug: string): Promise<Project> => {
    const response = await api.get(`/projects/slug/${slug}`);
    return response.data;
};

export const getProjectById = async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};

export const getSkills = async (): Promise<Skill[]> => {
    const response = await api.get('/skills');
    return response.data;
};

export const getExperience = async (): Promise<Experience[]> => {
    const response = await api.get('/experience');
    return response.data;
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
    const response = await api.get('/testimonials');
    return response.data;
};

export const getAchievements = async (): Promise<Achievement[]> => {
    const response = await api.get('/achievements');
    return response.data;
};

export const getAllPortfolioData = async () => {
    const [experience, projects, blogs, skills, testimonials, achievements] = await Promise.all([
        getExperience(),
        getProjects(),
        getBlogs(),
        getSkills(),
        getTestimonials(),
        getAchievements()
    ]);

    return { experience, projects, blogs, skills, testimonials, achievements };
};



export const sendMessage = async (messageData: { name: string; email: string; subject: string; message: string }) => {
    const response = await api.post('/messages', messageData);
    return response.data;
};

export const getGithubProfile = async () => {
    const response = await api.get('/github/profile');
    return response.data;
};

export const getGithubRepos = async () => {
    const response = await api.get('/github/repos');
    return response.data;
};

export const getPins = async () => {
    const response = await api.get('/pins');
    return response.data;
};

export const getBoards = async () => {
    const response = await api.get('/boards');
    return response.data;
};

export const getCodingPlatforms = async () => {
    const response = await api.get('/coding-platforms');
    return response.data;
};

export interface NoteFolder {
    _id: string;
    name: string;
    slug: string;
    color?: string;
    description?: string;
    noteCount?: number;
    updatedAt: string;
}

export interface Note {
    _id: string;
    title: string;
    content: string;
    content_html?: string;
    description?: string;
    slug: string;
    tags: string[];
    order?: number;
    updatedAt: string;
}

const getLeadingNumber = (value: string): number => {
    const match = value.match(/^\s*(\d+)/);
    return match ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
};

const sortStudyNotes = (notes: Note[]): Note[] => {
    return [...notes].sort((a, b) => {
        const aOrder = typeof a.order === 'number' ? a.order : Number.NaN;
        const bOrder = typeof b.order === 'number' ? b.order : Number.NaN;

        const hasAOrder = Number.isFinite(aOrder);
        const hasBOrder = Number.isFinite(bOrder);

        if (hasAOrder && hasBOrder && aOrder !== bOrder) {
            return aOrder - bOrder;
        }

        if (hasAOrder !== hasBOrder) {
            return hasAOrder ? -1 : 1;
        }

        const aNum = getLeadingNumber(a.title);
        const bNum = getLeadingNumber(b.title);

        if (aNum !== bNum) {
            return aNum - bNum;
        }

        return a.title.localeCompare(b.title);
    });
};

export const getPublicFolders = async (username?: string): Promise<{ success: boolean, data: { folders: NoteFolder[] } }> => {
    const params = username ? { username } : {};
    const response = await api.get('/public/notes/folders', { params });
    return response.data;
};

export const getPublicFolderBySlug = async (slug: string, username?: string): Promise<{ success: boolean, data: { folder: NoteFolder, notes: Note[] } }> => {
    const params = {
        page: 1,
        limit: 1000,
        sortBy: 'order',
        order: 'asc',
        ...(username ? { username } : {})
    };
    const response = await api.get(`/public/notes/folders/${slug}`, { params });
    if (response?.data?.success && Array.isArray(response?.data?.data?.notes)) {
        response.data.data.notes = sortStudyNotes(response.data.data.notes);
    }
    return response.data;
};

export const getPublicNoteBySlug = async (slug: string, username?: string): Promise<{ success: boolean, data: { note: Note } }> => {
    const params = username ? { username } : {};
    const response = await api.get(`/public/notes/notes/${slug}`, { params });
    return response.data;
};

export default api;

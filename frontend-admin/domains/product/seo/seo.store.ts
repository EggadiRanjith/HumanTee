/**
 * SEO Domain Store
 * Manages URL slug, meta tags, and search optimization
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface SEOState {
    // Data
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    tags: string[];

    // Dirty tracking
    isDirty: boolean;

    // Actions
    setSlug: (slug: string) => void;
    setMetaTitle: (title: string | undefined) => void;
    setMetaDescription: (description: string | undefined) => void;
    setTags: (tags: string[]) => void;
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;
    markClean: () => void;
    markDirty: () => void;
    reset: () => void;
}

const initialState = {
    slug: '',
    metaTitle: undefined,
    metaDescription: undefined,
    tags: [],
    isDirty: false,
};

export const useSEOStore = create<SEOState>()(
    immer((set) => ({
        ...initialState,

        setSlug: (slug) =>
            set((state) => {
                state.slug = slug;
                state.isDirty = true;
            }),

        setMetaTitle: (title) =>
            set((state) => {
                state.metaTitle = title;
                state.isDirty = true;
            }),

        setMetaDescription: (description) =>
            set((state) => {
                state.metaDescription = description;
                state.isDirty = true;
            }),

        setTags: (tags) =>
            set((state) => {
                state.tags = tags;
                state.isDirty = true;
            }),

        addTag: (tag) =>
            set((state) => {
                if (!state.tags.includes(tag)) {
                    state.tags.push(tag);
                    state.isDirty = true;
                }
            }),

        removeTag: (tag) =>
            set((state) => {
                state.tags = state.tags.filter((t) => t !== tag);
                state.isDirty = true;
            }),

        markClean: () =>
            set((state) => {
                state.isDirty = false;
            }),

        markDirty: () =>
            set((state) => {
                state.isDirty = true;
            }),

        reset: () => set(initialState),
    }))
);

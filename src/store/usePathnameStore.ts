import { create } from 'zustand';

interface PathState {
    previousPath: string | undefined;
    currentPath: string;
    setPaths: (newCurrentPath: string) => void;
}

export const usePathnameStore = create<PathState>((set) => ({
    previousPath: undefined,
    currentPath: window.location.pathname, // Default current path is the page on load
    setPaths: (newCurrentPath) => set((state) => ({
        previousPath: state.currentPath, // The previous path should be the current path before updating
        currentPath: newCurrentPath,
    })),
}));

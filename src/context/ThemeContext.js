import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || null;
    });

    const [showThemeModal, setShowThemeModal] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === null;
    });

    useEffect(() => {
        if (theme) {
            localStorage.setItem('theme', theme);
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(theme);
        }
    }, [theme]);

    const selectTheme = (selectedTheme) => {
        setTheme(selectedTheme);
        setShowThemeModal(false);
    };

    const value = {
        theme,
        setTheme,
        showThemeModal,
        setShowThemeModal,
        selectTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}; 
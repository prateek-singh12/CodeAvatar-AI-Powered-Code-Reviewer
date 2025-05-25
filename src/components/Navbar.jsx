import React, { useContext } from 'react'
import { FileCode2, Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    
    return (
        <div className="navbar flex justify-between items-center h-[50px] bg-indigo-600 dark:bg-purple-900">
            <div className="logo p-6 flex items-center gap-3">
                <FileCode2 size={28} color={theme === 'dark' ? '#CDC1FF' : '#ffffff'}  />
                <h1 className="text-[24px] font-bold text-white">
                    CodeAvatar
                </h1>
            </div>
            <div 
                onClick={toggleTheme}
                className="theme-toggle cursor-pointer group p-2 hover:bg-indigo-700 dark:hover:bg-purple-800 rounded-full transition-all duration-300"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? (
                    <Sun
                        size={24}
                        className="text-[#CDC1FF] group-hover:text-white group-hover:rotate-12 transition-all duration-300"
                    />
                ) : (
                    <Moon
                        size={24}
                        className="text-[#e0e7ff] group-hover:text-white group-hover:rotate-12 transition-all duration-300"
                    />
                )}
            </div>
        </div>
    )
}

export default Navbar
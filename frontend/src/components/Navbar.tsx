import React, { useState } from 'react';

const Navbar: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogout = () => {
        // Add logout logic here
        setIsLoggedIn(false);
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <a href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-gray-800">Logo</span>
                        </a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <a href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Home
                        </a>
                        <a href="/about" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            About
                        </a>
                        <a href="/services" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Services
                        </a>
                        <a href="/blog" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Blog
                        </a>
                        <a href="/contact" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Contact
                        </a>

                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                Logout
                            </button>
                        ) : (
                            <a
                                href="/login"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                Login
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 
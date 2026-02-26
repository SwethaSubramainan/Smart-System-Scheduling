import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Factory, Users, CalendarClock } from 'lucide-react';

const Navbar = () => {
    const navLinks = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Jobs', path: '/jobs', icon: <Briefcase size={20} /> },
        { name: 'Machines', path: '/machines', icon: <Factory size={20} /> },
        { name: 'Workers', path: '/workers', icon: <Users size={20} /> },
        { name: 'Schedule', path: '/schedule', icon: <CalendarClock size={20} /> },
    ];

    return (
        <nav className="bg-white shadow-md border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
                    <Factory size={28} />
                    <span>SmartScheduler</span>
                </div>

                <div className="hidden md:flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 font-medium ${isActive
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                                }`
                            }
                        >
                            {link.icon}
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                <div className="md:hidden flex items-center">
                    {/* Mobile menu button could go here */}
                    <button className="text-slate-500 hover:text-slate-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

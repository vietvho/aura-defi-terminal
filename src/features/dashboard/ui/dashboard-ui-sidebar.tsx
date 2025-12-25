"use client";
import {
    LayoutDashboard, Wallet, Repeat, Users, Megaphone,
    Settings, Search, LogOut, CheckCircle2
} from 'lucide-react';
import Image from 'next/image';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Wallet, label: 'Wallet', active: false },
    { icon: Repeat, label: 'Trade', active: false },
    { icon: Users, label: 'Community', active: false },
    { icon: Megaphone, label: 'Marketing', active: false },
];

interface DashboardUiSidebarProps {
    className?: string;
    onClose?: () => void;
}

export default function DashboardUiSidebar({ className = "", onClose }: DashboardUiSidebarProps) {
    return (
        <aside className={`w-64 h-screen bg-sidebar-bg border-r border-border-subtle flex flex-col p-4 ${className}`}>
            {/* Brand Logo */}
            <div className="flex items-center justify-between px-2 mb-8">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white/80 rounded-full blur-[1px]" />
                    </div>
                    <span className="text-xl font-bold text-white">Capsule</span>
                </div>
                {/* Mobile Close Button */}
                {onClose && (
                    <button onClick={onClose} className="md:hidden text-text-muted hover:text-white">
                        <LogOut className="w-5 h-5 rotate-180" />
                    </button>
                )}
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-[#161b26] border border-transparent focus:border-brand-blue/50 rounded-lg py-2 pl-10 pr-4 text-sm text-text-muted outline-none transition-all"
                />
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${item.active ? 'bg-nav-active text-white' : 'text-text-muted hover:text-white'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-text-muted'}`} />
                        <span className="text-sm font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-border-subtle space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-text-muted hover:text-white transition-colors">
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Settings</span>
                </button>

                {/* User Profile */}
                <div className="mt-6 flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10">
                            <Image
                                src="/avatar.png"
                                alt="Profile"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 w-4 h-4 text-brand-blue bg-sidebar-bg rounded-full p-0.5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-white">Warren Inc</span>
                            <span className="text-xs text-text-muted">wa***@gmail.com</span>
                        </div>
                    </div>
                    <LogOut className="w-5 h-5 text-text-muted cursor-pointer hover:text-white transition-colors" />
                </div>
            </div>
        </aside>
    );
}

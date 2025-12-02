'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    // If no role is stored, default to candidate and force re-login
    if (!role) {
      localStorage.clear();
      window.location.href = '/login';
      return;
    }
    setUserRole(role);
  }, []);

  return (
    <aside className="w-64 bg-white border-r border-gray-300 h-screen fixed left-0 top-14 shadow-sm">
      <nav className="p-0">
        <Link href="/dashboard" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 border-l-2 border-transparent hover:border-blue-600 hover:text-gray-900 transition-all duration-200 font-medium">
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
          Dashboard
        </Link>
        {userRole === 'candidate' ? (
          <>
            <Link href="/dashboard/jobs" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 border-l-2 border-transparent hover:border-blue-600 hover:text-gray-900 transition-all duration-200 font-medium">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
              </svg>
              Jobs
            </Link>
            <Link href="/dashboard/applications" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 border-l-2 border-transparent hover:border-blue-600 hover:text-gray-900 transition-all duration-200 font-medium">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h4a2 2 0 002-2V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
              My Applications
            </Link>
            <Link href="/dashboard/profile" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 border-l-2 border-transparent hover:border-blue-600 hover:text-gray-900 transition-all duration-200 font-medium">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard/manage-jobs" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 border-l-2 border-transparent hover:border-blue-600 hover:text-gray-900 transition-all duration-200 font-medium">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
              Manage Jobs
            </Link>
            <Link href="/dashboard/create-job" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 border-l-2 border-transparent hover:border-blue-600 hover:text-gray-900 transition-all duration-200 font-medium">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              Create Job
            </Link>
            <Link href="/dashboard/hr-applications" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 border-l-2 border-transparent hover:border-blue-600 hover:text-gray-900 transition-all duration-200 font-medium">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Applications
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}

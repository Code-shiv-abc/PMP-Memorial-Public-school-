/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { MainLayout } from './components/MainLayout';
import { PortalLayout } from './components/PortalLayout';
import { FullPageSpinner } from './components/FullPageSpinner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

const Home = React.lazy(() => import('./pages/Home'));
const Admissions = React.lazy(() => import('./pages/Admissions'));
const DigitalLibrary = React.lazy(() => import('./pages/DigitalLibrary'));
const PortalDashboard = React.lazy(() => import('./pages/PortalDashboard'));
const Courses = React.lazy(() => import('./pages/Courses'));
const About = React.lazy(() => import('./pages/About'));
const Faculty = React.lazy(() => import('./pages/Faculty'));
const Academics = React.lazy(() => import('./pages/Academics'));
const Events = React.lazy(() => import('./pages/Events'));
const Alumni = React.lazy(() => import('./pages/Alumni'));

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#ffffff',
              border: '1px solid #D4AF37',
            },
            duration: 4000,
          }}
        />
        <Router>
          <ScrollToTop />
          <Suspense fallback={<FullPageSpinner />}>
            <Routes>
          {/* Public Website Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/library" element={<DigitalLibrary />} />
            <Route path="/about" element={<About />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/events" element={<Events />} />
            <Route path="/alumni" element={<Alumni />} />
          </Route>

          {/* Portal/Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/portal" element={<PortalLayout />}>
              <Route index element={<PortalDashboard />} />
              <Route path="courses" element={<Courses />} />
              <Route path="assignments" element={<div className="p-8 text-center"><h2 className="text-2xl font-serif font-bold">Assignments</h2></div>} />
              <Route path="schedule" element={<div className="p-8 text-center"><h2 className="text-2xl font-serif font-bold">My Schedule</h2></div>} />
              <Route path="settings" element={<div className="p-8 text-center"><h2 className="text-2xl font-serif font-bold">Account Settings</h2></div>} />
            </Route>
          </Route>

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { MainLayout } from './components/MainLayout';
import { PortalLayout } from './components/PortalLayout';
import Home from './pages/Home';
import Admissions from './pages/Admissions';
import DigitalLibrary from './pages/DigitalLibrary';
import PortalDashboard from './pages/PortalDashboard';
import Courses from './pages/Courses';
import About from './pages/About';
import Faculty from './pages/Faculty';
import Academics from './pages/Academics';
import Events from './pages/Events';
import Alumni from './pages/Alumni';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
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
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<PortalDashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="assignments" element={<div className="p-8 text-center"><h2 className="text-2xl font-serif font-bold">Assignments</h2></div>} />
          <Route path="schedule" element={<div className="p-8 text-center"><h2 className="text-2xl font-serif font-bold">My Schedule</h2></div>} />
          <Route path="settings" element={<div className="p-8 text-center"><h2 className="text-2xl font-serif font-bold">Account Settings</h2></div>} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

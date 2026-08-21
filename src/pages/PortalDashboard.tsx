import React from 'react';
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { AlertCircle } from "lucide-react";
import StudentDashboard from "./StudentDashboard";
import ParentDashboard from "./ParentDashboard";
import AdminDashboard from "./AdminDashboard";
import DepartmentDashboard from "./DepartmentDashboard";

export default function PortalDashboard() {
  const { data: userData, loading, error } = useUserProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0F1115]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto p-6">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error || "Profile not found. Please contact your administrator."}</p>
        </div>
      </div>
    );
  }

  const role = userData.role;

  switch (role) {
    case 'admin':
      return <AdminDashboard />;
    case 'department':
      return <DepartmentDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return (
        <div className="space-y-6 max-w-6xl mx-auto p-6">
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>Unknown role: {role}. Please contact your administrator.</p>
          </div>
        </div>
      );
  }
}

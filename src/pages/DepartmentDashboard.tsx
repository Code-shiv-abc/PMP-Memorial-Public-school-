import React from 'react';
import { useUserProfile } from "@/src/hooks/useUserProfile";

export default function DepartmentDashboard() {
  const { data: userData } = useUserProfile();

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Department Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-300">Welcome to the department portal, {userData?.name || 'Faculty Member'}.</p>

      <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold mb-2">Profile Details</h2>
        <p className="text-gray-600 dark:text-gray-400"><strong>Name:</strong> {userData?.name}</p>
        <p className="text-gray-600 dark:text-gray-400"><strong>Role:</strong> <span className="capitalize">{userData?.role}</span></p>
      </div>

      <p className="text-gray-600 dark:text-gray-300">Here you can manage departmental courses and faculty.</p>
    </div>
  );
}

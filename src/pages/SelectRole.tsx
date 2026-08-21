import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, createUserDocWithRole, checkUserDocExists } from '../../lib/firebase';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Users, GraduationCap } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SelectRole() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const user = auth.currentUser;
    if (!user) {
      navigate('/', { replace: true });
      return;
    }

    // Check if user already has a role
    checkUserDocExists(user).then((exists) => {
      if (exists) {
        navigate('/portal', { replace: true });
      } else {
        setCheckingAuth(false);
      }
    }).catch((err) => {
      console.error('Error checking user doc', err);
      setCheckingAuth(false);
    });
  }, [navigate]);

  const handleSelectRole = async (role: string) => {
    setLoading(true);
    const user = auth.currentUser;
    if (!user) {
      toast.error('Authentication error. Please log in again.');
      navigate('/');
      return;
    }

    try {
      await createUserDocWithRole(user, role);
      toast.success(`Welcome to the ${role === 'student' ? 'Student' : 'Parent'} Portal!`);
      // Since this is inside Router context, navigate works, but we may want a full reload
      // or window.location to trigger App.tsx router state cleanly,
      // but navigate('/portal') should be fine inside React Router
      window.location.href = '/portal';
    } catch (error) {
      console.error('Error creating user role:', error);
      toast.error('Failed to set role. Please try again.');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0F1115]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0F1115] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to PMP Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please select your role to continue
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Card
            className="cursor-pointer hover:border-primary transition-colors hover:shadow-md"
            onClick={() => handleSelectRole('student')}
          >
            <CardContent className="flex items-center p-6">
              <User className="h-8 w-8 text-primary mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Student</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Access your courses, assignments, and grades</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary transition-colors hover:shadow-md"
            onClick={() => handleSelectRole('parent')}
          >
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-primary mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Parent</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Monitor academic progress and attendance</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading && (
          <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            Setting up your profile...
          </div>
        )}
      </div>
    </div>
  );
}

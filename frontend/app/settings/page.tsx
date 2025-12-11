'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/lib/api';
import { signOut } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  // Redirect if not logged in (using useEffect to avoid hydration issues)
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  const queryClient = useQueryClient();

  const [nameForm, setNameForm] = useState({
    name: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Fetch current user data
  const { data: userData } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await auth.me();
      return response.data.user;
    },
    enabled: !!session,
    onSuccess: (data) => {
      setNameForm({ name: data.name || '' });
    },
  });

  // Update name mutation
  const updateNameMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      return auth.updateProfile(data);
    },
    onSuccess: async (response) => {
      setNameSuccess('Name updated successfully!');
      setNameError('');
      
      // Update NextAuth session
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: response.data.user.name,
        },
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setNameSuccess(''), 3000);
    },
    onError: (error: any) => {
      setNameError(error.response?.data?.message || 'Failed to update name');
      setNameSuccess('');
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: { current_password: string; password: string; password_confirmation: string }) => {
      return auth.updateProfile(data);
    },
    onSuccess: () => {
      setPasswordSuccess('Password updated successfully!');
      setPasswordError('');
      setPasswordForm({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setPasswordSuccess(''), 3000);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.current_password?.[0] || 'Failed to update password';
      setPasswordError(errorMessage);
      setPasswordSuccess('');
    },
  });

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setNameSuccess('');

    if (!nameForm.name.trim()) {
      setNameError('Name cannot be empty');
      return;
    }

    updateNameMutation.mutate({ name: nameForm.name.trim() });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.current_password) {
      setPasswordError('Current password is required');
      return;
    }

    if (!passwordForm.password) {
      setPasswordError('New password is required');
      return;
    }

    if (passwordForm.password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    if (passwordForm.password !== passwordForm.password_confirmation) {
      setPasswordError('Passwords do not match');
      return;
    }

    updatePasswordMutation.mutate(passwordForm);
  };

  // Don't render content if not authenticated (redirect is in progress)
  if (status === 'unauthenticated') {
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Settings</h1>

        {/* Update Name Section */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Update Name</h2>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input
                type="text"
                className="input"
                placeholder="Your name"
                value={nameForm.name}
                onChange={(e) => setNameForm({ name: e.target.value })}
                required
              />
            </div>
            {nameError && (
              <div className="text-red-600 text-sm">{nameError}</div>
            )}
            {nameSuccess && (
              <div className="text-green-600 text-sm">{nameSuccess}</div>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updateNameMutation.isPending}
            >
              {updateNameMutation.isPending ? 'Updating...' : 'Update Name'}
            </button>
          </form>
        </div>

        {/* Update Password Section */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <input
                type="password"
                className="input"
                placeholder="Enter your current password"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">New Password</label>
              <input
                type="password"
                className="input"
                placeholder="Enter your new password (min 8 characters)"
                value={passwordForm.password}
                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input
                type="password"
                className="input"
                placeholder="Confirm your new password"
                value={passwordForm.password_confirmation}
                onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                required
                minLength={8}
              />
            </div>
            {passwordError && (
              <div className="text-red-600 text-sm">{passwordError}</div>
            )}
            {passwordSuccess && (
              <div className="text-green-600 text-sm">{passwordSuccess}</div>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updatePasswordMutation.isPending}
            >
              {updatePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900 mt-1">{session?.user?.email}</p>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            {session?.user?.is_moderator && (
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <p className="text-gray-900 mt-1">
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                    🛡️ Moderator
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

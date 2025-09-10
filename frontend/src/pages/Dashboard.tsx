import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import type { Move } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [moves, setMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMoves();
  }, []);

  const fetchMoves = async () => {
    try {
      const response = await apiService.getMoves();
      if (response.success && response.data) {
        setMoves(response.data);
      } else {
        setError(response.error || 'Failed to fetch moves');
      }
    } catch (err) {
      setError('Failed to fetch moves');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MoveEasy</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/moves/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                New Move
              </Link>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Moves</h2>
            
            {moves.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No moves yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first move.</p>
                <div className="mt-6">
                  <Link
                    to="/moves/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create Move
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {moves.map((move) => (
                  <div key={move.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {move.startLocation.city} → {move.endLocation.city}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(move.status)}`}>
                          {move.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Move Date:</strong> {formatDate(move.moveDate)}</p>
                        <p><strong>From:</strong> {move.startLocation.address}, {move.startLocation.city}, {move.startLocation.state}</p>
                        <p><strong>To:</strong> {move.endLocation.address}, {move.endLocation.city}, {move.endLocation.state}</p>
                        {move.householdSize && (
                          <p><strong>Household Size:</strong> {move.householdSize}</p>
                        )}
                        {move.inventorySizeEstimate && (
                          <p><strong>Inventory Size:</strong> {move.inventorySizeEstimate.replace('_', ' ')}</p>
                        )}
                      </div>
                      
                      <div className="mt-4 flex justify-between">
                        <div className="flex space-x-4">
                          <Link
                            to={`/moves/${move.id}/tasks`}
                            className="text-green-600 hover:text-green-500 text-sm font-medium"
                          >
                            Manage Tasks
                          </Link>
                          <Link
                            to={`/moves/${move.id}/inventory`}
                            className="text-purple-600 hover:text-purple-500 text-sm font-medium"
                          >
                            Manage Inventory
                          </Link>
                        </div>
                        <Link
                          to={`/moves/${move.id}`}
                          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

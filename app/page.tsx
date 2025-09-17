'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import MeteorList from '@/components/MeteorList';
import LoadingSpinner from '@/components/LoadingSpinner';
import { nasaApi } from '@/lib/nasaApi';
import type { MeteorEvent, APODResponse } from '@/types/meteor';

export default function Home() {
  const [meteors, setMeteors] = useState<MeteorEvent[]>([]);
  const [apod, setApod] = useState<APODResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch upcoming meteors and astronomy picture of the day in parallel
        const [meteorData, apodData] = await Promise.all([
          nasaApi.getUpcomingMeteors(),
          nasaApi.getAstronomyPictureOfDay().catch(() => null), // Don't fail if APOD fails
        ]);
        
        setMeteors(meteorData);
        setApod(apodData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🌠 PDX Meteor Tracker
            </h1>
            <p className="text-lg text-gray-600">
              Track Near Earth Objects and meteors approaching our planet
            </p>
          </div>
          <LoadingSpinner size="lg" text="Loading meteor data..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              🌠 PDX Meteor Tracker
            </h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-red-900 mb-2">Error Loading Data</h2>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🌠 PDX Meteor Tracker
          </h1>
          <p className="text-lg text-gray-600">
            Track Near Earth Objects and meteors approaching our planet
          </p>
        </div>

        {/* Astronomy Picture of the Day */}
        {apod && apod.media_type === 'image' && (
          <div className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <Image
              src={apod.url}
              alt={apod.title}
              width={800}
              height={256}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                📸 Astronomy Picture of the Day
              </h2>
              <h3 className="text-lg font-medium text-gray-800 mb-2">{apod.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {apod.explanation.length > 200
                  ? `${apod.explanation.substring(0, 200)}...`
                  : apod.explanation}
              </p>
              {apod.copyright && (
                <p className="mt-2 text-xs text-gray-500">© {apod.copyright}</p>
              )}
            </div>
          </div>
        )}

        {/* Meteor List */}
        <MeteorList meteors={meteors} title="Upcoming Near Earth Objects" />

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>
            Data provided by{' '}
            <a
              href="https://api.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              NASA Open Data Portal
            </a>
          </p>
          <p className="mt-1">
            Built with ❤️ for tracking celestial objects approaching Earth
          </p>
        </footer>
      </div>
    </div>
  );
}

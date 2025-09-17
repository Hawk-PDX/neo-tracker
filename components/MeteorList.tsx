'use client';

import { useState, useMemo } from 'react';
import type { MeteorEvent } from '@/types/meteor';
import MeteorCard from './MeteorCard';

interface MeteorListProps {
  meteors: MeteorEvent[];
  title?: string;
}

export default function MeteorList({ meteors, title = 'Meteors' }: MeteorListProps) {
  const [showOnlyHazardous, setShowOnlyHazardous] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'distance'>('date');

  const filteredAndSortedMeteors = useMemo(() => {
    let filtered = meteors;
    
    if (showOnlyHazardous) {
      filtered = meteors.filter(meteor => meteor.isHazardous);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.approachDate).getTime() - new Date(b.approachDate).getTime();
        case 'size':
          return b.estimatedSize.max - a.estimatedSize.max;
        case 'distance':
          return a.distance.value - b.distance.value;
        default:
          return 0;
      }
    });

    return sorted;
  }, [meteors, showOnlyHazardous, sortBy]);

  const hazardousCount = meteors.filter(meteor => meteor.isHazardous).length;

  if (meteors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🌌</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No meteors found</h2>
        <p className="text-gray-600">
          No meteor data available for the selected time period.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">
            {meteors.length} total meteors
            {hazardousCount > 0 && (
              <span className="ml-2 text-red-600 font-medium">
                ({hazardousCount} potentially hazardous)
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hazardous-filter"
              checked={showOnlyHazardous}
              onChange={(e) => setShowOnlyHazardous(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="hazardous-filter" className="ml-2 text-sm text-gray-700">
              Show only hazardous
            </label>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'size' | 'distance')}
            className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="date">Sort by approach date</option>
            <option value="size">Sort by size</option>
            <option value="distance">Sort by distance</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {filteredAndSortedMeteors.map((meteor) => (
          <MeteorCard key={meteor.id} meteor={meteor} />
        ))}
      </div>

      {filteredAndSortedMeteors.length === 0 && showOnlyHazardous && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No potentially hazardous meteors found in this time period.
          </p>
        </div>
      )}
    </div>
  );
}
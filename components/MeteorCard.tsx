'use client';

import { format } from 'date-fns';
import type { MeteorEvent } from '@/types/meteor';

interface MeteorCardProps {
  meteor: MeteorEvent;
}

export default function MeteorCard({ meteor }: MeteorCardProps) {
  const approachDate = new Date(meteor.approachDate);
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div
      className={`
        rounded-lg border p-6 shadow-md transition-all hover:shadow-lg
        ${
          meteor.isHazardous
            ? 'border-red-300 bg-red-50 hover:bg-red-100'
            : 'border-gray-200 bg-white hover:bg-gray-50'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {meteor.name}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {format(approachDate, 'MMMM d, yyyy \'at\' h:mm a')}
          </p>
        </div>
        {meteor.isHazardous && (
          <div className="ml-4 flex-shrink-0">
            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
              ⚠️ Potentially Hazardous
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Size Range</h4>
          <p className="mt-1 text-sm text-gray-900">
            {formatNumber(meteor.estimatedSize.min * 1000)} -{' '}
            {formatNumber(meteor.estimatedSize.max * 1000)} meters
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700">Velocity</h4>
          <p className="mt-1 text-sm text-gray-900">
            {formatNumber(meteor.velocity.value)} {meteor.velocity.unit}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700">Miss Distance</h4>
          <p className="mt-1 text-sm text-gray-900">
            {formatNumber(meteor.distance.value)} {meteor.distance.unit}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700">Object ID</h4>
        <p className="mt-1 text-xs font-mono text-gray-600">{meteor.id}</p>
      </div>
    </div>
  );
}
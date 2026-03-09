import React from 'react';

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: ({ score }: { score: any }) => void = ({ score }) => {
  let badgeColor: string = '';
  let badgeText: string = '';

  if ( score > 70 ) {
    badgeColor = 'bg-badge-green text-green-600';
    badgeText = 'Strong';
  } else if ( score > 49 ) {
    badgeColor = 'bg-badge-yellow text-yellow-600';
    badgeText = 'Moderate';
  } else {
    badgeColor = 'bg-badge-red text-red-600';
    badgeText = 'Poor';
  }

  return (
    <div className={`px-3 py-1 rounded-full ${badgeColor}`}>
      <p className="text-sm font-medium">{badgeText}</p>
    </div>
  );
};

export default ScoreBadge;
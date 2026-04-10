import React from 'react';

interface RecommendedCardProps {
  href: string;
  title: string;
}

const RecommendedCard: React.FC<RecommendedCardProps> = ({ href, title }) => {
  return (
    <a
      href={href}
      className="inline-block w-48 p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mb-4 text-center" // Added text-center class for centering text
    >
      <h5 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h5>
    </a>
  );
}

export default RecommendedCard;

"use client";

import { memo } from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

/**
 * Feature card component for displaying app features
 * Memoized to prevent unnecessary re-renders
 */
const FeatureCard = memo(function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="glass rounded-xl p-5 text-center card-hover">
      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center text-primary-400">
        {icon}
      </div>
      <h3 className="text-white font-medium mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
});

export default FeatureCard;

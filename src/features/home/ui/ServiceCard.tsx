"use client";

interface ServiceCardProps {
  title: string;
  description: string;
}

export const ServiceCard = ({ title, description }: ServiceCardProps) => {
  return (
    <div className="bg-background/80 dark:bg-background/40 backdrop-blur-md rounded-xl p-6 border border-border shadow-md">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

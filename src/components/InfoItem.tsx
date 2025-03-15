import React from "react";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
}

const InfoItem = ({ icon, label }: InfoItemProps) => (
  <div className="flex items-center gap-2 text-gray-700">
    {icon}
    <span>{label}</span>
  </div>
);

export default InfoItem;

import React from "react";

type TechIconProps = {
  component: React.ElementType;
};

const TechIcon: React.FC<TechIconProps> = ({ component: Icon }) => {
  return <Icon className="w-5 h-5 text-white" />;
};

export default TechIcon;
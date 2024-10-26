import React from "react";

type ButtonProps = {
  color: string;
  text: string;
  hoverColor: string;
  onClick: () => void;
};

const Button: React.FC<ButtonProps> = ({ color, hoverColor, text, onClick }) => {
  return (
    <button
      className={`rounded-md px-4 py-2 text-white ${color} hover:${hoverColor} transition-colors duration-300`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;

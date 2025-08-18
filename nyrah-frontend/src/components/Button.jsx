import React from "react";

const base = "btn transition-all duration-200";
const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  outline: "btn-outline",
  error: "btn-error",
};
const sizes = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
  icon: "btn-sm p-2",
  iconSm: "btn-xs p-1",
};

export const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

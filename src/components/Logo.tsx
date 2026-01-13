import { Droplets } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "light" | "dark";
}

export const Logo = ({ size = "md", showText = true, variant = "light" }: LogoProps) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const textColor = variant === "dark" ? "text-white" : "text-gray-900";

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Droplets className={`${sizes[size]} text-primary`} />
        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-semibold ${textColor}`}>
          Aqua Delivery
        </span>
      )}
    </div>
  );
};

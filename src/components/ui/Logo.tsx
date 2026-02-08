import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Show only the icon part (cropped) */
  iconOnly?: boolean;
  /** Variant for dark backgrounds */
  variant?: "default" | "dark";
}

const sizeMap = {
  xs: "h-6",
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
  xl: "h-16",
};

export function Logo({ size = "md", className, iconOnly }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="MedAnnot"
      className={cn(
        sizeMap[size],
        "w-auto object-contain",
        iconOnly && "max-w-[2.5em]",
        className
      )}
      draggable={false}
    />
  );
}

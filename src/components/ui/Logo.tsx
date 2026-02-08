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
  xs: "h-8",
  sm: "h-10",
  md: "h-12",
  lg: "h-16",
  xl: "h-20",
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

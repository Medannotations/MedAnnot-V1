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
  xs: "h-10",
  sm: "h-14",
  md: "h-20",
  lg: "h-24",
  xl: "h-32",
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

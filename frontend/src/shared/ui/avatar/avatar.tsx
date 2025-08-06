import { cn } from "@/lib/utils";
import Avatar from "react-avatar";

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  size?: number;
  round?: boolean | string;
  color?: string;
}

export function AvatarCustom({
  className,
  src,
  alt,
  fallback,
  size = 40,
  round = true,
  color = "#000000",
  ...props
}: AvatarProps) {
  return (
    <Avatar
      src={src || undefined}
      name={fallback || alt || "?"}
      size={String(size)}
      color={color}
      round={round}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}

export { AvatarCustom as Avatar };

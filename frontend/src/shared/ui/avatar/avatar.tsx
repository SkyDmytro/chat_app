import * as React from "react";
import { cn } from "@/lib/utils";
import ChatPlaceholder from "@assets/chat_placeholder.jpg";

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const handleError = () => {
      setImageError(true);
    };

    if (imageError || !src) {
      return (
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-gray-300 text-sm font-medium",
            className
          )}
        >
          {fallback || alt?.charAt(0)?.toUpperCase() || "?"}
        </div>
      );
    }

    return (
      <img
        ref={ref}
        src={src || ChatPlaceholder}
        alt={alt}
        onError={handleError}
        className={cn("h-10 w-10 rounded-full object-cover", className)}
        {...props}
      />
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };

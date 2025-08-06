import { cn } from "@/lib/utils";

interface ImageMessageProps {
  src: string;
  alt?: string;
  isOwn?: boolean;
}

export function ImageMessage({
  src,
  alt = "image",
  isOwn = false,
}: ImageMessageProps) {
  return (
    <div className={cn("flex mb-2", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-md",
          isOwn
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-200 border border-gray-700"
        )}
      >
        <img
          src={src}
          alt={alt}
          className="rounded-lg max-w-full h-auto object-cover mb-1"
        />
      </div>
    </div>
  );
}

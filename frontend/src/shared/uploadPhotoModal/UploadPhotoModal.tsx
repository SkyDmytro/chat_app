import { useRef, useState } from "react";
import { Button } from "@/shared/ui/button";

interface UploadPhotoModalProps {
  onClose: () => void;
  onUpload: (file: File) => void;
}

export function UploadPhotoModal({ onClose, onUpload }: UploadPhotoModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h3 className="text-white mb-4 text-lg font-semibold">Upload Image</h3>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 w-full text-white file:bg-blue-600 file:text-white file:rounded file:px-3 file:py-1 file:border-none file:mr-2"
        />
        {preview && (
          <div className="mb-4 flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 rounded-lg border border-gray-700"
            />
          </div>
        )}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 bg-transparent border border-gray-700 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!file}
          >
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}

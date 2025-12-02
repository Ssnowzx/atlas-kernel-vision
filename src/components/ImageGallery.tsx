import { Camera } from "lucide-react";

interface CometImage {
  id: string;
  filename: string;
  timestamp: string;
  description: string;
}

interface ImageGalleryProps {
  images: CometImage[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Camera className="h-5 w-5 text-blue-400" />
        Imagens Capturadas - Cometa 3I/ATLAS
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        Núcleo e coma do cometa interestelar
      </p>
      <div className="grid grid-cols-3 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-gray-900/50 rounded-lg overflow-hidden"
          >
            <div className="aspect-video bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
              <Camera className="h-12 w-12 text-gray-600" />
            </div>
            <div className="p-3">
              <div className="text-xs font-mono text-gray-500 mb-1">
                {img.timestamp}
              </div>
              <div className="text-sm font-semibold mb-1">{img.filename}</div>
              <div className="text-xs text-gray-400">{img.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

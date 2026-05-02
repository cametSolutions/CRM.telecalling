
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./getCroppedImg";
import uploadImageToCloudinary from "../../utils/uploadImageToCloudinary";

export default function AvatarEditor({ open, onClose, onUploaded }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setLoading(true);

      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!blob) {
        console.error("No blob created from canvas");
        return;
      }

      const data = await uploadImageToCloudinary(blob);
      console.log("Cloudinary response:", data);

      if (data?.secure_url) {
        onUploaded(data.secure_url);
        setImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        onClose();
      } else {
        console.error("Cloudinary upload failed:", data);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            Update Profile Photo
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="mb-4 block w-full text-xs"
        />

        {imageSrc && (
          <div className="relative mb-4 h-64 w-full overflow-hidden rounded-xl bg-slate-100">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
          <button
            type="button"
            onClick={handleUpload}
            disabled={!imageSrc || loading}
            className="whitespace-nowrap rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
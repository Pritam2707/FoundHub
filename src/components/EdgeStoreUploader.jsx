import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { uploadToEdgeStore } from '../services/edgestore';

export default function EdgeStoreUploader({ onUploadComplete, initialUrl = '' }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialUrl);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate size (< 10MB) and type
    if (!selected.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP)');
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB');
      return;
    }

    setError(null);
    setFile(selected);
    setIsUploading(true);
    setProgress(10);

    try {
      const res = await uploadToEdgeStore(selected, (p) => {
        setProgress(p);
      });
      setPreviewUrl(res.url);
      onUploadComplete(res.url);
      setIsUploading(false);
    } catch (err) {
      setError('Upload failed. Please try again or paste a photo link.');
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl('');
    setProgress(0);
    onUploadComplete('');
  };

  return (
    <div className="space-y-2">
      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 aspect-video max-h-48 group">
          <img src={previewUrl} alt="Uploaded attachment" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-stone-900/70 text-white hover:bg-stone-900 transition-all opacity-90 group-hover:opacity-100"
            title="Remove photo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-sm text-[10px] font-bold text-pastel-mint-dark flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Ready / Uploaded</span>
          </div>
        </div>
      ) : (
        <label className="border-2 border-dashed border-stone-200 hover:border-brand-primary/50 bg-stone-50/70 hover:bg-stone-50 p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2 py-2">
              <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
              <span className="text-xs font-semibold text-stone-700">Uploading to Cloud ({progress}%)...</span>
              <div className="w-36 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-primary transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-1.5 py-1">
              <div className="w-9 h-9 rounded-xl bg-pastel-lavender-light text-pastel-lavender-dark flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-stone-800">
                Click or Drag to Upload Photo
              </span>
              <span className="text-[11px] text-stone-400">
                Supports JPG, PNG, WebP up to 10MB (EdgeStore Cloud Bucket)
              </span>
            </div>
          )}
        </label>
      )}

      {error && (
        <div className="flex items-center space-x-1.5 text-xs text-pastel-rose-dark bg-pastel-rose-light p-2 rounded-xl border border-pastel-rose-border">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

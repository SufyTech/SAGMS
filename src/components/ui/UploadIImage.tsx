"use client";
import { useState } from "react";

const UploadImage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data.result || data.message);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow-md">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload & Analyze
      </button>
      {result && (
        <div className="mt-4 p-2 bg-gray-100 border rounded">
          <strong>Result:</strong> {result}
        </div>
      )}
    </div>
  );
};

export default  UploadImage;

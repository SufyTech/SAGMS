'use client';


import { useState, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/PgLit2Mwx/";

export default function UploadImage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);

  // Load the model
  useEffect(() => {
    const loadModel = async () => {
      const modelURL = MODEL_URL + "model.json";
      const metadataURL = MODEL_URL + "metadata.json";
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
    };

    loadModel();

    // Get location
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocation(coords);
        const name = await fetchLocationName(coords.lat, coords.lng);
        setLocationName(name);
      },
      (err) => {
        console.warn("Location access denied:", err.message);
      }
    );
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const fetchLocationName = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      return data.display_name;
    } catch (err) {
      console.error("Error fetching location name:", err);
      return null;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !model) return;

    const imageElement = document.createElement("img");
    imageElement.src = URL.createObjectURL(selectedFile);

    imageElement.onload = async () => {
      const prediction = await model.predict(imageElement);
      const best = prediction.reduce((prev, curr) =>
        curr.probability > prev.probability ? curr : prev
      );

      const result = {
        type: best.className,
        severity: best.className === "Plastic" ? "High" : "Medium",
        suggestion:
          best.className === "Plastic"
            ? "Deploy cleanup team immediately"
            : "Schedule standard cleaning",
      };

      setResult(result);
    };
  };

  const handleReport = async () => {
    if (!result || !location || !selectedFile) {
      alert("Missing analysis result, location, or image.");
      return;
    }

    const reportData = {
      type: result.type,
      severity: result.severity,
      suggestion: result.suggestion,
      latitude: location.lat,
      longitude: location.lng,
      imageName: selectedFile.name,
    };

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Complaint successfully submitted to the municipal department!");
        console.log("Reported Data:", data.report);
      } else {
        alert(`❌ Failed to submit complaint: ${data.error}`);
      }
    } catch (err) {
      console.error("Report submission error:", err);
      alert("An error occurred while reporting. Please try again.");
    }
  };

  return (
    <div className="p-4 shadow-md bg-white rounded-md max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Report Waste</h2>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <input type="file" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload & Analyze
        </button>
      </div>

      {previewUrl && (
        <div className="mt-4">
          <p className="font-semibold mb-2">Image Preview:</p>
          <img src={previewUrl} alt="Selected" className="max-w-xs rounded" />
        </div>
      )}

      {result && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <p className="font-semibold mb-2">AI Analysis Result:</p>
          <p><strong>Type:</strong> {result.type}</p>
          <p><strong>Severity:</strong> {result.severity}</p>
          <p><strong>Suggestion:</strong> {result.suggestion}</p>

          {locationName && (
            <p className="mt-2"><strong>Location:</strong> {locationName}</p>
          )}

          <button
            onClick={handleReport}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            🚨 Report to Authorities
          </button>
        </div>
      )}
    </div>
  );
}

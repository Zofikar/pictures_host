'use client'
import type { fileUploadResponse } from "@/types";
import axios from "axios";
import { useState } from 'react';

export default function UploadImage() {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();
  const [fileUploadData, setFileUploadData] = useState<fileUploadResponse>();


  const handleUpload = async () => {
    setUploading(true);
    try {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("file", selectedFile);
      const { data } = await axios.post("/api/image", formData);
      console.log(data);
    } catch (error: any) {
      console.log(error.response?.data);
    }
    setUploading(false);
  };

  return (
      <div className="justify-center items-center w-full h-full flex">
        <div className="p-20 space-y-6">
            <label>
                <input
                type="file"
                hidden
                accept="image/*"
                onChange={({ target }) => {
                    if (target.files) {
                    const file = target.files[0];
                    setSelectedImage(URL.createObjectURL(file));
                    setSelectedFile(file);
                    }
                }}
                />
                <div className="w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
                {selectedImage ? (
                    <img src={selectedImage} alt="" />
                ) : (
                    <span>Select Image</span>
                )}
                </div>
            </label>
            <button
                onClick={handleUpload}
                disabled={uploading}
                style={{ opacity: uploading ? ".5" : "1" }}
                className="bg-red-600 p-3 w-32 text-center rounded text-white"
            >
                {uploading ? "Uploading.." : "Upload"}
            </button>
        </div>
    </div>
  )
}

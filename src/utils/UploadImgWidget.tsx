// UploadImgWidget.tsx
import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";

interface UploadImgWidgetProps {
  onImagesUpload: (imageUrls: string) => void;
}

function UploadImgWidget({ onImagesUpload }: UploadImgWidgetProps) {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();
  const [imageUrls, setImageUrls] = useState<string>();

  useEffect(() => {
    cloudinaryRef.current = (window as any).cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dby2saqmn",
        uploadPreset: "chuongchim",
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          const imageUrl = result.info.url;
          setImageUrls(imageUrl);

          onImagesUpload(imageUrl);
        }
      }
    );
  }, [onImagesUpload, imageUrls]);

  return (
    <div>
      <Button
        onClick={() => {
          widgetRef.current.open();
        }}
      >
        Upload Image
      </Button>
    </div>
  );
}

export default UploadImgWidget;

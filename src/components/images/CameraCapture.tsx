import { useRef, useState } from "react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";

export const CameraCapture = ({ open, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });

    setStream(mediaStream);
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play();
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current!.videoWidth;
    canvas.height = videoRef.current!.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx!.drawImage(videoRef.current!, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
        onCapture(file);
        stopCamera();
        onClose();
      }
    });
  };

  return (
    <>
      <video ref={videoRef} className="w-full rounded-lg" />
      <Button onClick={capturePhoto}>Capture</Button>
      <Button
        variant="outline"
        onClick={() => {
          stopCamera();
          onClose();
        }}
      >
        Close
      </Button>
    </>
  );
};

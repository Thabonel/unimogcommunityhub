import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CameraCaptureProps {
  isOpen: boolean;
  onCapture: (file: File) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  isOpen,
  onCapture,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const startCamera = async () => {
      try {
        setError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCapturing(true);
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : 'Unable to access camera. Please check permissions.';
        setError(errorMsg);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageData);
    }
  };

  const handleConfirm = () => {
    if (!capturedImage || !canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const timestamp = new Date().toISOString().split('T')[0];
        const file = new File([blob], `invoice-${timestamp}.jpg`, {
          type: 'image/jpeg',
        });
        onCapture(file);
        handleClose();
      }
    }, 'image/jpeg', 0.9);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleClose = () => {
    setCapturedImage(null);
    setIsCapturing(false);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Capture Invoice
          </DialogTitle>
        </DialogHeader>

        {error ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
            <Button onClick={handleClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        ) : capturedImage ? (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <img
                src={capturedImage}
                alt="Captured invoice"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleRetake}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake
              </Button>
              <Button onClick={handleConfirm} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Confirm
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleCapture}
                disabled={!isCapturing}
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                Capture
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

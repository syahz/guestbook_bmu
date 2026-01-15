"use client"

import Image from "next/image"
import { Camera, RefreshCcw, User } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"

type SelfieCaptureProps = {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function SelfieCapture({ value, onChange, error }: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const stopCamera = useCallback(() => {
    const tracks = streamRef.current?.getTracks()
    tracks?.forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraOpen(false)
  }, [])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  const startCamera = async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })
      streamRef.current = stream
      setIsCameraOpen(true)

      requestAnimationFrame(() => {
        const video = videoRef.current
        if (!video || !streamRef.current) return
        video.srcObject = streamRef.current
        video
          .play()
          .catch(() => setCameraError("Pemutaran kamera diblokir oleh browser."))
      })
    } catch (err) {
      console.error(err)
      setCameraError("Tidak dapat mengakses kamera. Pastikan izin sudah diberikan.")
      setIsCameraOpen(false)
    }
  }

  useEffect(() => {
    if (!isCameraOpen || !streamRef.current) return
    const video = videoRef.current
    if (!video) return
    video.srcObject = streamRef.current
    video.play().catch(() => setCameraError("Pemutaran kamera diblokir oleh browser."))
  }, [isCameraOpen])

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const dataUrl = canvas.toDataURL("image/png")
    onChange(dataUrl)
    stopCamera()
  }

  const retakePhoto = () => {
    onChange("")
    startCamera()
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
        {value ? (
          <div className="relative">
            <div className="relative h-72 w-full">
              <Image
                src={value}
                alt="Selfie"
                fill
                unoptimized
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="rounded-b-none rounded-t-2xl object-cover"
              />
            </div>
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={retakePhoto}
                className="shadow-sm"
              >
                <RefreshCcw className="size-4" /> Foto ulang
              </Button>
            </div>
          </div>
        ) : isCameraOpen ? (
          <div className="relative bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-72 w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <button
                type="button"
                onClick={capturePhoto}
                className="h-14 w-14 rounded-full border-4 border-white/70 bg-white/90 shadow-xl transition hover:scale-105"
                aria-label="Ambil foto"
              />
            </div>
          </div>
        ) : (
          <div className="flex h-72 flex-col items-center justify-center gap-3 text-center text-slate-600">
            <div className="flex size-16 items-center justify-center rounded-full bg-white shadow-sm">
              <User className="size-7 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Ambil foto selfie</p>
              <p className="text-xs text-slate-500">Foto wajah diperlukan untuk registrasi tamu.</p>
            </div>
            <Button type="button" size="sm" onClick={startCamera}>
              <Camera className="size-4" /> Buka kamera
            </Button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
      {(error || cameraError) && (
        <p className="text-sm text-red-600">{error ?? cameraError}</p>
      )}
    </div>
  )
}

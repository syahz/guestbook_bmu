"use client"

import { Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"

type SignaturePadProps = {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function SignaturePad({ value, onChange, error }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ratio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio

    const context = canvas.getContext("2d")
    if (context) {
      context.scale(ratio, ratio)
      context.lineWidth = 2.5
      context.lineCap = "round"
      context.lineJoin = "round"
      context.strokeStyle = "#000000"
      context.fillStyle = "#ffffff"
      context.fillRect(0, 0, rect.width, rect.height)
    }
  }, [])

  const getCoordinates = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    const context = canvasRef.current?.getContext("2d")
    if (!context) return

    const { x, y } = getCoordinates(event)
    context.beginPath()
    context.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    event.preventDefault()
    const context = canvasRef.current?.getContext("2d")
    if (!context) return

    const { x, y } = getCoordinates(event)
    context.lineTo(x, y)
    context.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    if (canvasRef.current) {
      onChange(canvasRef.current.toDataURL("image/png"))
    }
  }

  const clearSignature = () => {
    const context = canvasRef.current?.getContext("2d")
    const canvas = canvasRef.current
    if (!context || !canvas) return

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1))
    onChange("")
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white">
        <canvas
          ref={canvasRef}
          className="h-60 w-full touch-none bg-white"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
        />
        {!value && !isDrawing && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-semibold text-black/40">
            Tanda tangan di sini
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="text-slate-600 hover:text-red-600"
          onClick={clearSignature}
        >
          <Trash2 className="size-4" /> Hapus
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

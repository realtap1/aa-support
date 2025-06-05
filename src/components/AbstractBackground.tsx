"use client"

import { useEffect, useRef } from "react"

export default function AbstractBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.error("Failed to get canvas context")
      return
    }

    // Set canvas to full window size
    const resizeCanvas = () => {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      drawBackground() // Redraw when resized
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Function to draw the background
    function drawBackground() {
      const width = canvas!.width
      const height = canvas!.height
      const context = ctx!
      
      // Create black shiny background
      const backgroundGradient = context.createLinearGradient(0, 0, width, height)
      backgroundGradient.addColorStop(0, "#000000")
      backgroundGradient.addColorStop(0.5, "#0a0a0a") // Slightly lighter for "shiny" effect
      backgroundGradient.addColorStop(1, "#000000")

      context.fillStyle = backgroundGradient
      context.fillRect(0, 0, width, height)

      // Add subtle sheen to make it look shiny
      const sheenGradient = context.createRadialGradient(
        width * 0.5,
        height * 0.5,
        0,
        width * 0.5,
        height * 0.5,
        width * 0.8,
      )
      sheenGradient.addColorStop(0, "rgba(30, 30, 30, 0.1)")
      sheenGradient.addColorStop(0.5, "rgba(20, 20, 20, 0.05)")
      sheenGradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      context.fillStyle = sheenGradient
      context.fillRect(0, 0, width, height)

      // Create light source in top right corner
      const lightX = width * 0.8
      const lightY = height * 0.2

      // Create the light gradient
      const lightGradient = context.createRadialGradient(lightX, lightY, 0, lightX, lightY, width * 0.7)

      // Light blue colors with transparency
      lightGradient.addColorStop(0, "rgba(120, 200, 255, 0.15)")
      lightGradient.addColorStop(0.1, "rgba(100, 180, 255, 0.1)")
      lightGradient.addColorStop(0.3, "rgba(80, 160, 255, 0.05)")
      lightGradient.addColorStop(0.6, "rgba(60, 140, 255, 0.025)")
      lightGradient.addColorStop(1, "rgba(40, 120, 255, 0)")

      context.fillStyle = lightGradient
      context.fillRect(0, 0, width, height)

      // Add a more concentrated glow at the source
      const centerGlow = context.createRadialGradient(lightX, lightY, 0, lightX, lightY, width * 0.1)

      centerGlow.addColorStop(0, "rgba(150, 220, 255, 0.08)")
      centerGlow.addColorStop(1, "rgba(100, 180, 255, 0)")

      context.fillStyle = centerGlow
      context.fillRect(0, 0, width, height)

      // Add a subtle directional beam toward the center
      context.beginPath()
      const beamGradient = context.createLinearGradient(lightX, lightY, width * 0.5, height * 0.5)

      beamGradient.addColorStop(0, "rgba(120, 200, 255, 0.05)")
      beamGradient.addColorStop(1, "rgba(80, 160, 255, 0)")

      context.fillStyle = beamGradient

      // Create a beam path from light source to center
      context.moveTo(lightX, lightY)
      context.lineTo(lightX - width * 0.1, lightY + height * 0.1)
      context.lineTo(width * 0.4, height * 0.6)
      context.lineTo(width * 0.5, height * 0.5)
      context.lineTo(width * 0.6, height * 0.4)
      context.lineTo(lightX + width * 0.05, lightY - height * 0.05)
      context.closePath()
      context.fill()
    }

    // Add subtle animation
    let time = 0
    const animate = () => {
      // Only redraw occasionally for subtle effect
      if (time % 60 === 0) {
        drawBackground()
      }

      time++
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    drawBackground()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed left-0 top-0 -z-10 h-full w-full bg-black" aria-hidden="true" />
}

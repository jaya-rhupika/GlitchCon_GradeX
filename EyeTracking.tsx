"use client"
import { FaceMesh } from "@mediapipe/face_mesh";
import { useEffect, useRef, useState } from "react"
import * as mediapipe from "@mediapipe/face_mesh"
import * as drawingUtils from "@mediapipe/drawing_utils"
import * as controlsUtils from "@mediapipe/control_utils"

export default function EyeTracking() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [faceMeshDetected, setFaceMeshDetected] = useState(false)
  const [multiplesFacesDetected, setMultipleFacesDetected] = useState(false)
  const [isLookingAway, setIsLookingAway] = useState(false)

  useEffect(() => {
    let faceMesh: mediapipe.FaceMesh | null = null
    let animationFrameId: number | null = null

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }

        const faceMesh = new FaceMesh({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 2,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        })

        faceMesh.onResults((results) => {
          if (canvasRef.current && videoRef.current) {
            const canvasCtx = canvasRef.current.getContext('2d')
            const canvasElement = canvasRef.current
            
            // Clear previous drawing
            canvasCtx?.clearRect(0, 0, canvasElement.width, canvasElement.height)

            // Set canvas size to match video
            canvasElement.width = videoRef.current.videoWidth
            canvasElement.height = videoRef.current.videoHeight

            // Draw video frame on canvas
            if (canvasCtx) {
              canvasCtx.drawImage(videoRef.current, 0, 0, canvasElement.width, canvasElement.height)
            }

            // Process face detection results
            if (results.multiFaceLandmarks) {
              // Update face detection states
              setFaceMeshDetected(true)
              setMultipleFacesDetected(results.multiFaceLandmarks.length > 1)

              results.multiFaceLandmarks.forEach((landmarks) => {
                // Draw face mesh
                if (canvasCtx) {
                  drawingUtils.drawConnectors(canvasCtx, landmarks, mediapipe.FACEMESH_TESSELATION, {
                    color: '#C0C0C070',
                    lineWidth: 1
                  })
                }

                // Eye landmark indices (approximated)
                const leftEyeLandmarks = landmarks.filter((_, index) => 
                  index >= 33 && index < 133
                )
                const rightEyeLandmarks = landmarks.filter((_, index) => 
                  index >= 362 && index < 462
                )

                // Calculate eye centers
                const getEyeCenter = (eyeLandmarks: typeof landmarks) => {
                  const xCoords = eyeLandmarks.map(l => l.x)
                  const yCoords = eyeLandmarks.map(l => l.y)
                  return {
                    x: xCoords.reduce((a, b) => a + b, 0) / xCoords.length,
                    y: yCoords.reduce((a, b) => a + b, 0) / yCoords.length
                  }
                }

                const leftEyeCenter = getEyeCenter(leftEyeLandmarks)
                const rightEyeCenter = getEyeCenter(rightEyeLandmarks)

                // Detect looking away (simplified)
                const isAway = leftEyeCenter.x < 0.3 || rightEyeCenter.x > 0.7
                setIsLookingAway(isAway)

                // Optional: Draw eye centers for visualization
                if (canvasCtx) {
                  canvasCtx.beginPath()
                  canvasCtx.arc(leftEyeCenter.x * canvasElement.width, 
                                 leftEyeCenter.y * canvasElement.height, 
                                 5, 0, 2 * Math.PI)
                  canvasCtx.fillStyle = 'red'
                  canvasCtx.fill()

                  canvasCtx.beginPath()
                  canvasCtx.arc(rightEyeCenter.x * canvasElement.width, 
                                 rightEyeCenter.y * canvasElement.height, 
                                 5, 0, 2 * Math.PI)
                  canvasCtx.fillStyle = 'red'
                  canvasCtx.fill()
                }
              })
            } else {
              // No face detected
              setFaceMeshDetected(false)
            }
          }
        })

        // Create a helper function to process video frames
        const processVideoFrame = async () => {
          if (videoRef.current && faceMesh) {
            await faceMesh.send({ image: videoRef.current })
          }
          animationFrameId = requestAnimationFrame(processVideoFrame)
        }

        // Start processing
        await faceMesh.initialize()
        processVideoFrame()

      } catch (err) {
        console.error("Error accessing webcam or initializing face mesh:", err)
      }
    }

    startWebcam()

    // Cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video 
        ref={videoRef} 
        width="100%" 
        height="100%" 
        style={{ objectFit: "cover" }} 
        muted 
        playsInline 
      />
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%' 
        }} 
      />
      {!faceMeshDetected && (
        <div style={{ 
          position: 'absolute', 
          top: 10, 
          left: 10, 
          color: 'yellow', 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          padding: '5px' 
        }}>
          NO FACE DETECTED!
        </div>
      )}
      {multiplesFacesDetected && (
        <div style={{ 
          position: 'absolute', 
          top: 50, 
          left: 10, 
          color: 'red', 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          padding: '5px' 
        }}>
          MULTIPLE FACES DETECTED! ALERT!
        </div>
      )}
      {isLookingAway && (
        <div style={{ 
          position: 'absolute', 
          top: 90, 
          left: 10, 
          color: 'red', 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          padding: '5px' 
        }}>
          LOOKING AWAY! ALERT!
        </div>
      )}
    </div>
  )
}
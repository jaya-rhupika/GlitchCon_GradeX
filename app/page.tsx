"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, ArrowRight, User, Users, BookOpen, Camera, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AuthPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [showFaceVerification, setShowFaceVerification] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [signupFormData, setSignupFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  })
  const [formErrors, setFormErrors] = useState<{
    signup?: { [key: string]: string }
    login?: { [key: string]: string }
  }>({})

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignupFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateLoginForm = () => {
    const errors: { [key: string]: string } = {}

    if (!loginFormData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(loginFormData.email)) {
      errors.email = "Email is invalid"
    }

    if (!loginFormData.password) {
      errors.password = "Password is required"
    }

    if (!selectedRole) {
      errors.role = "Please select a role"
    }

    setFormErrors({ login: errors })
    return Object.keys(errors).length === 0
  }

  const validateSignupForm = () => {
    const errors: { [key: string]: string } = {}

    if (!signupFormData.firstName) {
      errors.firstName = "First name is required"
    }

    if (!signupFormData.lastName) {
      errors.lastName = "Last name is required"
    }

    if (!signupFormData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(signupFormData.email)) {
      errors.email = "Email is invalid"
    }

    if (!signupFormData.password) {
      errors.password = "Password is required"
    } else if (signupFormData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (signupFormData.password !== signupFormData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    if (!selectedRole) {
      errors.role = "Please select a role"
    }

    setFormErrors({ signup: errors })
    return Object.keys(errors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateLoginForm()) {
      toast({
        title: "Invalid form",
        description: "Please check the form for errors",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // This is where you would integrate with PostgreSQL
      // Example fetch call (replace with your actual endpoint)
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     email: loginFormData.email,
      //     password: loginFormData.password,
      //     role: selectedRole
      //   })
      // })

      // Simulating a PostgreSQL check
      // In a real implementation, this would be a server-side check
      const mockUserExists = loginFormData.email === "user@example.com" && loginFormData.password === "password123"

      if (mockUserExists) {
        toast({
          title: "Login successful",
          description: `Welcome back! You are logged in as ${selectedRole}`,
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      })
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSignupForm()) {
      toast({
        title: "Invalid form",
        description: "Please check the form for errors",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate checking if user already exists
    setTimeout(() => {
      setIsLoading(false)
      // Open face verification dialog
      setShowFaceVerification(true)
    }, 1000)
  }

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to complete face verification",
        variant: "destructive",
      })
    }
  }, [toast])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = canvas.toDataURL("image/png")
        setCapturedImage(imageData)
      }
    }
  }, [])

  const handleVerificationComplete = async () => {
    stopCamera()
    setShowFaceVerification(false)
    setIsLoading(true)

    try {
      // This is where you would integrate with PostgreSQL to save the user
      // Example fetch call (replace with your actual endpoint)
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...signupFormData,
      //     role: selectedRole,
      //     faceImage: capturedImage
      //   })
      // })

      // Simulate successful signup
      setTimeout(() => {
        setIsLoading(false)
        toast({
          title: "Account created",
          description: "Your account has been created successfully. You can now login.",
        })

        // For demo purposes, set the mock user credentials
        toast({
          title: "Demo credentials",
          description: "For testing, use email: user@example.com and password: password123",
        })
      }, 1500)
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Signup failed",
        description: "An error occurred during signup. Please try again.",
        variant: "destructive",
      })
      console.error("Signup error:", error)
    }
  }

  const handleVerificationCancel = () => {
    stopCamera()
    setShowFaceVerification(false)
    setCapturedImage(null)
  }

  const roleCards = [
    {
      id: "student",
      title: "Student",
      description: "Access exams, view results, and track your progress",
      icon: User,
      color: "bg-blue-500",
    },
    {
      id: "faculty",
      title: "Faculty",
      description: "Create exams, manage question banks, and view student results",
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      id: "admin",
      title: "Administrator",
      description: "Manage users, monitor exams, and access system analytics",
      icon: Users,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[url('/grid.svg')] bg-contain">
      <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />

      <div className="container relative z-10 flex flex-col items-center justify-center space-y-6 px-4 py-8 md:px-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="flex items-center justify-center rounded-full bg-primary p-2"
          >
            <Shield className="h-10 w-10 text-primary-foreground" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">ExamSafe</h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              A secure, AI-powered examination management system
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <form onSubmit={handleLogin}>
                  <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        value={loginFormData.email}
                        onChange={handleLoginChange}
                        className={formErrors.login?.email ? "border-red-500" : ""}
                      />
                      {formErrors.login?.email && <p className="text-xs text-red-500">{formErrors.login.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <Button variant="link" className="h-auto p-0 text-xs">
                          Forgot password?
                        </Button>
                      </div>
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        value={loginFormData.password}
                        onChange={handleLoginChange}
                        className={formErrors.login?.password ? "border-red-500" : ""}
                      />
                      {formErrors.login?.password && (
                        <p className="text-xs text-red-500">{formErrors.login.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Select your role</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {roleCards.map((role) => (
                          <motion.div
                            key={role.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedRole(role.id)}
                            className={`cursor-pointer rounded-lg border p-2 text-center transition-colors ${
                              selectedRole === role.id
                                ? "border-primary bg-primary/10"
                                : "hover:border-muted-foreground/20"
                            }`}
                          >
                            <div
                              className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full ${role.color}`}
                            >
                              <role.icon className="h-4 w-4 text-white" />
                            </div>
                            <p className="text-xs font-medium">{role.title}</p>
                          </motion.div>
                        ))}
                      </div>
                      {formErrors.login?.role && <p className="text-xs text-red-500">{formErrors.login.role}</p>}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                          <span>Logging in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span>Login</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <form onSubmit={handleSignup}>
                  <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>Enter your information to create an account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First name</Label>
                        <Input
                          id="first-name"
                          name="firstName"
                          placeholder="John"
                          value={signupFormData.firstName}
                          onChange={handleSignupChange}
                          className={formErrors.signup?.firstName ? "border-red-500" : ""}
                        />
                        {formErrors.signup?.firstName && (
                          <p className="text-xs text-red-500">{formErrors.signup.firstName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input
                          id="last-name"
                          name="lastName"
                          placeholder="Doe"
                          value={signupFormData.lastName}
                          onChange={handleSignupChange}
                          className={formErrors.signup?.lastName ? "border-red-500" : ""}
                        />
                        {formErrors.signup?.lastName && (
                          <p className="text-xs text-red-500">{formErrors.signup.lastName}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        value={signupFormData.email}
                        onChange={handleSignupChange}
                        className={formErrors.signup?.email ? "border-red-500" : ""}
                      />
                      {formErrors.signup?.email && <p className="text-xs text-red-500">{formErrors.signup.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        value={signupFormData.password}
                        onChange={handleSignupChange}
                        className={formErrors.signup?.password ? "border-red-500" : ""}
                      />
                      {formErrors.signup?.password && (
                        <p className="text-xs text-red-500">{formErrors.signup.password}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        value={signupFormData.confirmPassword}
                        onChange={handleSignupChange}
                        className={formErrors.signup?.confirmPassword ? "border-red-500" : ""}
                      />
                      {formErrors.signup?.confirmPassword && (
                        <p className="text-xs text-red-500">{formErrors.signup.confirmPassword}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Select your role</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {roleCards.map((role) => (
                          <motion.div
                            key={role.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedRole(role.id)}
                            className={`cursor-pointer rounded-lg border p-2 text-center transition-colors ${
                              selectedRole === role.id
                                ? "border-primary bg-primary/10"
                                : "hover:border-muted-foreground/20"
                            }`}
                          >
                            <div
                              className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full ${role.color}`}
                            >
                              <role.icon className="h-4 w-4 text-white" />
                            </div>
                            <p className="text-xs font-medium">{role.title}</p>
                          </motion.div>
                        ))}
                      </div>
                      {formErrors.signup?.role && <p className="text-xs text-red-500">{formErrors.signup.role}</p>}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span>Create account</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Face Verification Dialog */}
      <Dialog
        open={showFaceVerification}
        onOpenChange={(open) => {
          if (!open) handleVerificationCancel()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Face Verification</DialogTitle>
            <DialogDescription>
              Please position your face in the frame and take a photo for verification.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center space-y-4">
            {!capturedImage ? (
              <>
                <div className="relative w-full h-64 bg-muted rounded-md overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        videoRef.current.play()
                      }
                    }}
                  />
                  <div className="absolute inset-0 border-4 border-dashed border-primary/50 pointer-events-none rounded-md"></div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
                <Button
                  onClick={() => {
                    captureImage()
                    startCamera()
                  }}
                  className="w-full"
                  onMouseEnter={startCamera}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
              </>
            ) : (
              <>
                <div className="relative w-full h-64 bg-muted rounded-md overflow-hidden">
                  <img
                    src={capturedImage || "/placeholder.svg"}
                    alt="Captured face"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex space-x-2 w-full">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCapturedImage(null)
                      startCamera()
                    }}
                    className="flex-1"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Retake
                  </Button>
                  <Button onClick={handleVerificationComplete} className="flex-1">
                    <Check className="mr-2 h-4 w-4" />
                    Confirm
                  </Button>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={handleVerificationCancel}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


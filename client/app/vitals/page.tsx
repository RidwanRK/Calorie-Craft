"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap, User, Target, Calculator, ArrowRight, Info } from "lucide-react"

export default function VitalsPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    height: "",
    weight: "",
    activityLevel: "",
    goal: "",
    dailyCalories: 0,
    dailyProtein: 0,
    dailyCarbs: 0,
    dailyFat: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const calculateNutrition = () => {
    if (!formData.weight || !formData.activityLevel || !formData.goal) return

    const baseCalories = Number.parseInt(formData.weight) * 24
    const activityMultiplier =
      {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
      }[formData.activityLevel] || 1.55

    const goalMultiplier =
      {
        lose: 0.8,
        maintain: 1.0,
        gain: 1.2,
      }[formData.goal] || 1.0

    const calories = Math.round(baseCalories * activityMultiplier * goalMultiplier)
    const protein = Math.round(Number.parseInt(formData.weight) * 2)
    const fat = Math.round((calories * 0.3) / 9)
    const carbs = Math.round((calories - protein * 4 - fat * 9) / 4)

    setFormData((prev) => ({
      ...prev,
      dailyCalories: calories,
      dailyProtein: protein,
      dailyCarbs: carbs,
      dailyFat: fat,
    }))
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.age || !formData.sex || !formData.height || !formData.weight) {
        alert("Please fill in all personal information")
        return
      }
    } else if (step === 2) {
      if (!formData.activityLevel || !formData.goal) {
        alert("Please select your activity level and goal")
        return
      }
      calculateNutrition()
    }
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert("Profile created successfully! Your personalized meal plan is being generated.")
    router.push("/")
    setIsLoading(false)
  }

  const progress = (step / 3) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">Calorie Craft</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h1>
          <p className="text-gray-600">We need some information to create your personalized meal plan</p>

          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {step} of 3</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>Basic information to calculate your nutritional needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={(e) => handleChange("age", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sex</Label>
                    <RadioGroup
                      value={formData.sex}
                      onValueChange={(value) => handleChange("sex", value)}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="Enter your height"
                      value={formData.height}
                      onChange={(e) => handleChange("height", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Enter your weight"
                      value={formData.weight}
                      onChange={(e) => handleChange("weight", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button onClick={handleNext} className="w-full bg-green-600 hover:bg-green-700">
                  Next Step
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Goals & Activity Level</span>
                </CardTitle>
                <CardDescription>Tell us about your fitness goals and activity level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="activityLevel">Activity Level</Label>
                  <Select
                    value={formData.activityLevel}
                    onValueChange={(value) => handleChange("activityLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                      <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                      <SelectItem value="very_active">Very Active (very hard exercise, physical job)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Primary Goal</Label>
                  <Select value={formData.goal} onValueChange={(value) => handleChange("goal", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose">Lose Weight</SelectItem>
                      <SelectItem value="maintain">Maintain Weight</SelectItem>
                      <SelectItem value="gain">Gain Weight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleNext} className="flex-1 bg-green-600 hover:bg-green-700">
                    Calculate Nutrition
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>Your Personalized Plan</span>
                </CardTitle>
                <CardDescription>Review your nutritional requirements and confirm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-green-200 bg-green-50">
                  <Info className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Based on your information, we've calculated your daily nutritional needs. These will be used to
                    generate your personalized meal plans.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{formData.dailyCalories}</div>
                    <div className="text-sm text-gray-600">Daily Calories</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{formData.dailyProtein}g</div>
                    <div className="text-sm text-gray-600">Protein</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{formData.dailyCarbs}g</div>
                    <div className="text-sm text-gray-600">Carbohydrates</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{formData.dailyFat}g</div>
                    <div className="text-sm text-gray-600">Fat</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Your Profile Summary:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Age: {formData.age} years</div>
                    <div>Sex: {formData.sex}</div>
                    <div>Height: {formData.height} cm</div>
                    <div>Weight: {formData.weight} kg</div>
                    <div>Activity: {formData.activityLevel}</div>
                    <div>Goal: {formData.goal} weight</div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Profile..." : "Complete Setup"}
                    {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

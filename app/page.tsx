"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Dumbbell, Moon, Sun, Calendar, Trophy } from "lucide-react"
import { useTheme } from "next-themes"

const rutinaData = {
  rutina: [
    {
      dia: "Pecho",
      ejercicios: ["Press Plano", "Press Inclinado", "Aperturas", "Tríceps en Poleas"],
    },
    {
      dia: "Espalda",
      ejercicios: ["Dorsalera", "Dominadas", "Remo", "Jalón Unilateral", "Face Pull"],
    },
    {
      dia: "Hombros",
      ejercicios: ["Press Militar", "Vuelo Lateral", "Posteriores en Máquina", "Bíceps en Scott (W)"],
    },
    {
      dia: "Piernas",
      ejercicios: [
        "Prensa",
        "Aductores",
        "Sillón de Cuádriceps",
        "Camilla de Isquios",
        "Gemelos",
        "Sentadilla",
        "Hip Thrust",
      ],
    },
  ],
}

export default function GymRoutine() {
  const { setTheme, theme } = useTheme()
  const [completedExercises, setCompletedExercises] = useState<{ [key: string]: boolean }>({})
  const [activeDay, setActiveDay] = useState("Pecho")

  const toggleExercise = (day: string, exercise: string) => {
    const key = `${day}-${exercise}`
    setCompletedExercises((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const getCompletedCount = (day: string) => {
    const dayData = rutinaData.rutina.find((d) => d.dia === day)
    if (!dayData) return 0

    return dayData.ejercicios.filter((exercise) => completedExercises[`${day}-${exercise}`]).length
  }

  const resetDay = (day: string) => {
    const dayData = rutinaData.rutina.find((d) => d.dia === day)
    if (!dayData) return

    const newCompleted = { ...completedExercises }
    dayData.ejercicios.forEach((exercise) => {
      delete newCompleted[`${day}-${exercise}`]
    })
    setCompletedExercises(newCompleted)
  }

  return (
    <div className="min-h-screen from-slate-50 to-slate-100 dark:bg-slate-800 dark:hover:bg-slate-900 dark:border-slate-700 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
          {theme === "dark" ? (
            <Sun className="h-8 w-8 text-orange-600" />
          ) : (
            <Moon className="h-8 w-8 text-orange-600" />
          )}
        </Button>
          <div className="flex items-center justify-center gap-2">
            <Dumbbell className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Mi Rutina</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">Entrena con constancia y alcanza tus metas</p>
        </div>

        {/* Stats Card */}
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span className="font-medium">Progreso de Hoy</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {getCompletedCount(activeDay)}/
                {rutinaData.rutina.find((d) => d.dia === activeDay)?.ejercicios.length || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Routine Tabs */}
        <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-1 h-auto p-1 bg-white shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700">
            {rutinaData.rutina.slice(0, 2).map((dia) => (
              <TabsTrigger
                key={dia.dia}
                value={dia.dia}
                className="flex flex-col gap-1 py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <span className="font-medium">{dia.dia}</span>
                <Badge variant="secondary" className="text-xs">
                  {getCompletedCount(dia.dia)}/{dia.ejercicios.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsList className="grid w-full grid-cols-2 gap-1 h-auto p-1 bg-white shadow-sm mt-2 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700">
            {rutinaData.rutina.slice(2, 4).map((dia) => (
              <TabsTrigger
                key={dia.dia}
                value={dia.dia}
                className="flex flex-col gap-1 py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <span className="font-medium">{dia.dia}</span>
                <Badge variant="secondary" className="text-xs">
                  {getCompletedCount(dia.dia)}/{dia.ejercicios.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {rutinaData.rutina.map((dia) => (
            <TabsContent key={dia.dia} value={dia.dia} className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Día de {dia.dia}</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => resetDay(dia.dia)} className="text-slate-600 dark:text-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700">
                  Reiniciar
                </Button>
              </div>
              <div className="space-y-3">
                {dia.ejercicios.map((ejercicio, index) => {
                  const isCompleted = completedExercises[`${dia.dia}-${ejercicio}`]
                  return (
                    <Card
                      key={index}
                      className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
                        isCompleted
                          ? "bg-green-50 border-green-200 shadow-sm dark:bg-green-900 dark:border-green-700"
                          : "bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-900 dark:border-slate-700"
                      }`}
                      onClick={() => toggleExercise(dia.dia, ejercicio)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
                              {index + 1}
                            </div>
                            <span
                              className={`font-medium ${
                                isCompleted ? "text-green-700 line-through" 
                                            : "text-slate-700 dark:text-slate-400"
                              }`}
                            >
                              {ejercicio}
                            </span>
                          </div>
                          {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                          ) : (
                            <Circle className="h-6 w-6 text-slate-400 dark:text-slate-100" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Progress Summary */}
              <Card className="bg-slate-50 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {getCompletedCount(dia.dia)}/{dia.ejercicios.length}
                  </div>
                  <p className="text-slate-600 text-sm dark:text-slate-300">ejercicios completados</p>
                  {getCompletedCount(dia.dia) === dia.ejercicios.length && (
                    <Badge className="mt-2 bg-green-500 hover:bg-green-600">¡Día completado! 🎉</Badge>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

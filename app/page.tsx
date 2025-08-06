"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Dumbbell, Moon, Sun, Settings, Calendar, Trophy, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import rutinaDefault from "@/app/data/default.json"

type DiaRutina = {
  dia: string
  ejercicios: string[]
}

export default function GymRoutine() {
  const [rutina, setRutina] = useState<DiaRutina[]>([])
  const [nuevoDia, setNuevoDia] = useState("")
  const [nuevoEjercicio, setNuevoEjercicio] = useState<{ [key: string]: string }>({})
  const [ejercicioCompleto, setEjercicioCompleto] = useState<{ [key: string]: boolean }>(() => {
    // Cargar distintas cosas en LocalStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ejercicioCompleto")
      const rutinaStored = localStorage.getItem("rutina")
      if (rutinaStored) {
        setRutina(JSON.parse(rutinaStored))
      }
      return stored ? JSON.parse(stored) : {}
    }
    return {}
  })
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ejercicioCompleto", JSON.stringify(ejercicioCompleto))
      localStorage.setItem("rutina", JSON.stringify(rutina))
    }
  }, [ejercicioCompleto, rutina])

  const {theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [diaActivo, setDiaActivo] = useState<string>("")
  const [configuracionCompleta, setConfiguracionCompleta] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null

  const toggleConfiguracion = () => {
    setConfiguracionCompleta(!configuracionCompleta)
  }

  const agregarDia = () => {
    if (nuevoDia.trim() && !rutina.some(d => d.dia === nuevoDia)) {
      const nuevaRutina = [...rutina, { dia: nuevoDia.trim(), ejercicios: [] }]
      setRutina(nuevaRutina)
      setNuevoDia("")
      setDiaActivo(nuevoDia.trim())
    }
  }

  const isRoutineEmpty = rutina.length === 0
  const rutinaEjemplo = rutinaDefault as DiaRutina[]

  const usarDefault = () => {
    if (isRoutineEmpty) {
      setRutina(rutinaEjemplo)
      setDiaActivo(rutinaEjemplo[0].dia)
      setConfiguracionCompleta(true)
      setNuevoDia("")
      setNuevoEjercicio({}) 
    }
  }

  if (isRoutineEmpty) {
    return (
      <div className="flex items-center justify-center min-h-screen from-slate-50 to-slate-100 dark:bg-slate-900 dark:border-slate-700 p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <CardContent>
            <h2 className="text-xl font-bold mb-4">¡Bienvenido a tu rutina de gimnasio!</h2>
            <p className="text-gray-300 mb-6">Para comenzar, agrega un día de entrenamiento o puedes utilizar la rutina de ejemplo que te proporcionamos.</p>
            <div className="flex gap-2">
              <Input
                placeholder="Nombre del día (Ej: Pecho)"
                value={nuevoDia}
                onChange={(exercise) => setNuevoDia(exercise.target.value)}
              />
            </div>
            
            <Button variant="outline" size="sm" onClick={agregarDia} className="bg-orange-500 hover:bg-orange-600 text-white padding-2 mt-4">
                Agregar Día
            </Button>

            <Button variant="outline" size="sm" onClick={usarDefault}className="bg-orange-500 hover:bg-orange-600 text-white padding-2 mt-4">
                Rutina de ejemplo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // aqui agregare los ejercicioss
  const agregarEjercicio = (dia: string) => {
    const ejercicio = nuevoEjercicio[dia]?.trim()
    if (ejercicio) {
      const nuevaRutina = rutina.map(d => 
        d.dia === dia ? { ...d, ejercicios: [...d.ejercicios, ejercicio] } : d
      )
      setRutina(nuevaRutina)
      setNuevoEjercicio({ ...nuevoEjercicio, [dia]: "" })
    }
  }

  const borrarEjercicio = (dia: string, ejercicio: string) => {
    const nuevaRutina = rutina.map(d =>
      d.dia === dia ? { ...d, ejercicios: d.ejercicios.filter(e => e !== ejercicio) } : d
    )
    setRutina(nuevaRutina)
  }

  const toggleExercise = (day: string, exercise: string) => {
    const key = `${day}-${exercise}`
    setEjercicioCompleto((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const getCompletedCount = (day: string) => {
    const dia = rutina.find(d => d.dia === day)
    if (!dia) return 0
    return dia.ejercicios.filter((exercise) => ejercicioCompleto[`${day}-${exercise}`]).length
  }

  const resetDay = (day: string) => {
    const updated = { ...ejercicioCompleto }
    rutina.find(d => d.dia === day)?.ejercicios.forEach(exercise => delete updated[`${day}-${exercise}`])
    setEjercicioCompleto(updated)
  }

  const borrarRutina = (day: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("rutina")
      setRutina([])
      setDiaActivo("")
      setEjercicioCompleto({})
    }
  }

  const borrarDia = (day: string) => {
    const nuevaRutina = rutina.filter(d => d.dia !== day)
    setRutina(nuevaRutina)
    if (diaActivo === day) {
      setDiaActivo(nuevaRutina.length > 0 ? nuevaRutina[0].dia : "")
    }
  } 

  return (
    <div className="min-h-screen from-slate-50 to-slate-100 dark:bg-slate-900 dark:border-slate-700 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* mi "header" */}
        <div className="text-center space-y-4 pt-8" style={{ padding: "0px" }}>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="bg-orange-300 dark:bg-orange-900 hover:bg-orange-300 mr-2" 
            >
            {theme === "dark" ? (
              <Sun className="h-8 w-8 text-orange-600" />
            ) : (
              <Moon className="h-8 w-8 text-orange-700" />
            )}
          </Button>

          <Button
            onClick={() => toggleConfiguracion()}
            className="bg-orange-300 dark:bg-orange-900 hover:bg-orange-300"
            >
            <Settings className="h-8 w-8 text-orange-600"/>
            <p className="text-gray-300">Editar Rutina</p>
          </Button>

          <div className="flex items-center justify-center gap-2">
            <Dumbbell className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Mi Rutina</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">Entrena con constancia y alcanza tus metas!</p>
        </div>

        {/* Badge de modo edición */}
        {!configuracionCompleta && (
            <div className="flex justify-center">
              <Badge className="bg-blue-500 text-white">Modo edición activado</Badge>
            </div>
        )}

        {/* agregar día */}
        {!configuracionCompleta && (
          <div className="flex gap-2">
            <Input
              placeholder="Nombre del día (Ej: Pecho)"
              value={nuevoDia}
              onChange={(e) => setNuevoDia(e.target.value)}
            />
            <Button variant="outline" size="sm" onClick={agregarDia} className="text-slate-600 dark:text-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700">
              Agregar Día
            </Button>
          </div>
        )}

        {/* stats */}
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span className="font-medium">Progreso de Hoy</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {getCompletedCount(diaActivo)}/
                {rutina.find((d) => d.dia === diaActivo)?.ejercicios.length || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>        

        {/* tabs de las rutinas */}
        <Tabs value={diaActivo} onValueChange={setDiaActivo} className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-1 h-auto p-1 bg-white shadow-sm dark:bg-slate-800 dark:border-slate-700">
            {rutina.map((d) => (
              <TabsTrigger key={d.dia} value={d.dia} className="flex flex-col gap-1 py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <span className="font-medium">{d.dia}</span>
                <Badge variant="secondary" className="text-xs">
                  {getCompletedCount(d.dia)}/{d.ejercicios.length}
                </Badge>
                {!configuracionCompleta ? (
                            <X className="h-6 w-6 text-red-600 cursor-pointer bg-blue-300 rounded" onClick={(e) => {
                              e.stopPropagation() 
                              borrarDia(d.dia)
                            }}/>
                          ) : null
                          }
              </TabsTrigger>
            ))}
          </TabsList>

          {!diaActivo && (
            <Card className="bg-gradient-to-r from-blue-500 to-purple-900 text-white border-0 dark:border-slate-700 mt-4 p-4">
              <div className="p-4 text-center">
                <span className="font-medium">Seleccioná un día para comenzar con el entrenamiento!</span>
            </div>
            </Card>
          )}

          {rutina.map((dia) => (
            <TabsContent key={dia.dia} value={dia.dia} className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Día de {dia.dia}</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => resetDay(dia.dia)} className="text-slate-600 dark:text-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700">
                  Reiniciar día
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEjercicioCompleto({})} className="text-slate-600 dark:text-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700">
                  Borrar progreso
                </Button>
              </div>

              {/* agregar ejercicio */}
              {!configuracionCompleta && (
                <div className="flex gap-2">
                <Input
                  placeholder={`Ejercicio para ${dia.dia}`}
                  value={nuevoEjercicio[dia.dia] || ""}
                  onChange={(exercise) => setNuevoEjercicio({ ...nuevoEjercicio, [dia.dia]: exercise.target.value })}
                />
                <Button variant="outline" size="sm" onClick={() => agregarEjercicio(dia.dia)} className="text-slate-600 dark:text-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700">
                  Agregar
                </Button>
              </div>
              )}

              {/* boton para borrar la rutina del localStorage */}
              {!configuracionCompleta && (
                <Button variant="outline" size="sm" onClick={() => borrarRutina(dia.dia)} className="text-slate-600 dark:text-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700">
                  Borrar rutina
                </Button>
              )}
              
              {/* lista de ejercicios */}
              <div className="space-y-3">
                {dia.ejercicios.map((ejercicio, index) => {
                  const isCompleted = ejercicioCompleto[`${dia.dia}-${ejercicio}`]
                  return (
                    <Card
                      key={index}
                      className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
                        isCompleted
                          ? "bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700"
                          : "bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-900 dark:border-slate-700"
                      }`}
                      onClick={() => {
                        if (configuracionCompleta) toggleExercise(dia.dia, ejercicio)
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-400 text-slate-800 font-bold text-sm">
                              {index + 1}
                            </div>
                            <span
                              className={`font-medium ${
                                isCompleted ? "text-green-700 line-through" : "text-slate-700 dark:text-slate-400"
                              }`}
                            >
                              {ejercicio}
                            </span>
                          </div>
                          {!configuracionCompleta ? (
                            <X className="h-6 w-6 text-red-600 cursor-pointer bg-blue-300 rounded" onClick={(e) => {
                              e.stopPropagation() 
                              borrarEjercicio(dia.dia, ejercicio)
                            }}/>
                          ) : 
                          isCompleted ? (
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
              
              {/* contador de ejercicios completados y felicitacion XD */}
              <Card className="bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {getCompletedCount(dia.dia)}/{dia.ejercicios.length}
                  </div>
                  <p className="text-sm">ejercicios completados</p>
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
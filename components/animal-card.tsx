"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import LetterTile from "./letter-tile"
import DropZone from "./drop-zone"
import { CheckCircle } from "lucide-react"

interface AnimalCardProps {
  animal: {
    id: number
    name: string
    image: string
    scrambled: string
    currentArrangement: string[]
    isCorrect: boolean
  }
  updateLetterArrangement: (animalId: number, letterIndex: number, letter: string, sourceIndex: number) => void
}

export default function AnimalCard({ animal, updateLetterArrangement }: AnimalCardProps) {
  const [usedLetters, setUsedLetters] = useState<{ [key: string]: boolean }>({})

  // Handle dropping a letter into a drop zone
  const handleDrop = (letterIndex: number, letter: string, sourceIndex: number) => {
    updateLetterArrangement(animal.id, letterIndex, letter, sourceIndex)
  }

  // Reset a letter (remove it from the arrangement)
  const resetLetter = (letterIndex: number) => {
    updateLetterArrangement(animal.id, letterIndex, "", -1)
  }

  return (
    <Card className={`transition-all duration-300 ${animal.isCorrect ? "bg-green-50 border-green-300" : "bg-white"}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Animal image */}
          <div className="relative">
            <Image
              src={animal.image || "/placeholder.svg"}
              alt={animal.name}
              width={150}
              height={150}
              className="rounded-lg object-cover"
            />
            {animal.isCorrect && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                <CheckCircle className="h-6 w-6" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-6">
            {/* Drop zones for arranged letters */}
            <div className="flex justify-center gap-2">
              {animal.name.split("").map((_, index) => (
                <DropZone
                  key={`drop-${animal.id}-${index}`}
                  index={index}
                  letter={animal.currentArrangement[index]}
                  onDrop={(letter, sourceIndex) => handleDrop(index, letter, sourceIndex)}
                  onReset={() => resetLetter(index)}
                  isCorrect={animal.isCorrect}
                />
              ))}
            </div>

            {/* Scrambled letters */}
            <div className="flex justify-center gap-2 mt-4">
              {animal.scrambled.split("").map((letter, index) => (
                <LetterTile
                  key={`tile-${animal.id}-${index}`}
                  letter={letter}
                  index={index}
                  isUsed={animal.currentArrangement.includes(letter)}
                  isCorrect={animal.isCorrect}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


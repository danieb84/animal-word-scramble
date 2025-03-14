"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"
import { usePreview } from "react-dnd-preview"
import AnimalCard from "./animal-card"
import { useMobile } from "@/hooks/use-mobile"
import confetti from "canvas-confetti"

// Animal data with images and names
const animals = [
  {
    id: 1,
    name: "cat",
    image: "/cat.svg?height=150&width=150&text=CAT",
    scrambled: "tca",
  },
  {
    id: 2,
    name: "pig",
    image: "/pig.svg?height=150&width=150&text=PIG",
    scrambled: "gip",
  },
  {
    id: 3,
    name: "duck",
    image: "/duck.svg?height=150&width=150&text=DUCK",
    scrambled: "kcud",
  },
  {
    id: 4,
    name: "horse",
    image: "/horse.svg?height=150&width=150&text=HORSE",
    scrambled: "oehrs",
  },
]

// Function to shuffle letters
const shuffleLetters = (word: string): string => {
  const letters = word.split("")
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[letters[i], letters[j]] = [letters[j], letters[i]]
  }
  return letters.join("")
}

// Preview component for touch devices
const DndPreview = () => {
  const { display, itemType, item, style } = usePreview()
  if (!display) {
    return null
  }

  return (
    <div className="fixed z-50 pointer-events-none" style={style}>
      <div className="w-12 h-12 flex items-center justify-center bg-yellow-400 rounded-lg text-2xl font-bold text-white shadow-lg">
        {item.letter}
      </div>
    </div>
  )
}

export default function WordScrambleGame() {
  const [gameState, setGameState] = useState<{
    animals: {
      id: number
      name: string
      image: string
      scrambled: string
      currentArrangement: string[]
      isCorrect: boolean
    }[]
    allCorrect: boolean
  }>({
    animals: [],
    allCorrect: false,
  })

  const isMobile = useMobile()
  const backend = isMobile ? TouchBackend : HTML5Backend

  // Initialize game state
  useEffect(() => {
    const initializedAnimals = animals.map((animal) => {
      // Make sure the scrambled version is different from the correct spelling
      let scrambledLetters = shuffleLetters(animal.name)
      while (scrambledLetters === animal.name) {
        scrambledLetters = shuffleLetters(animal.name)
      }

      return {
        ...animal,
        scrambled: scrambledLetters,
        currentArrangement: Array(animal.name.length).fill(""),
        isCorrect: false,
      }
    })

    setGameState({
      animals: initializedAnimals,
      allCorrect: false,
    })
  }, [])

  // Check if all animals are correctly spelled
  useEffect(() => {
    if (gameState.animals.length > 0) {
      const allCorrect = gameState.animals.every((animal) => animal.isCorrect)

      if (allCorrect && !gameState.allCorrect) {
        setGameState((prev) => ({ ...prev, allCorrect: true }))

        // Trigger confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }
    }
  }, [gameState.animals])

  // Reset the game
  const resetGame = () => {
    const resetAnimals = gameState.animals.map((animal) => {
      let scrambledLetters = shuffleLetters(animal.name)
      while (scrambledLetters === animal.name) {
        scrambledLetters = shuffleLetters(animal.name)
      }

      return {
        ...animal,
        scrambled: scrambledLetters,
        currentArrangement: Array(animal.name.length).fill(""),
        isCorrect: false,
      }
    })

    setGameState({
      animals: resetAnimals,
      allCorrect: false,
    })
  }

  // Update letter arrangement and check if correct
  const updateLetterArrangement = (animalId: number, letterIndex: number, letter: string, sourceIndex: number) => {
    setGameState((prevState) => {
      const updatedAnimals = prevState.animals.map((animal) => {
        if (animal.id === animalId) {
          const newArrangement = [...animal.currentArrangement]

          // If the letter is already in the arrangement, remove it
          const existingIndex = newArrangement.findIndex((l) => l === letter && l !== "")
          if (existingIndex !== -1 && existingIndex !== letterIndex) {
            newArrangement[existingIndex] = ""
          }

          newArrangement[letterIndex] = letter

          // Check if the word is correctly spelled
          const isCorrect = newArrangement.join("") === animal.name

          return {
            ...animal,
            currentArrangement: newArrangement,
            isCorrect,
          }
        }
        return animal
      })

      return {
        ...prevState,
        animals: updatedAnimals,
      }
    })
  }

  return (
    <DndProvider backend={backend}>
      {isMobile && <DndPreview />}

      <div className="space-y-8">
        {gameState.animals.map((animal) => (
          <AnimalCard key={animal.id} animal={animal} updateLetterArrangement={updateLetterArrangement} />
        ))}

        {gameState.allCorrect && (
          <div className="mt-8 text-center">
            <div className="text-2xl font-bold text-green-600 mb-4">
              Congratulations! You spelled all the animal names correctly!
            </div>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </DndProvider>
  )
}


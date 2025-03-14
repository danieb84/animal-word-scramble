"use client"

import { useDrag } from "react-dnd"
import { motion } from "framer-motion"

interface LetterTileProps {
  letter: string
  index: number
  isUsed: boolean
  isCorrect: boolean
}

export default function LetterTile({ letter, index, isUsed, isCorrect }: LetterTileProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "letter",
    item: { letter, sourceIndex: index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !isUsed && !isCorrect,
  }))

  return (
    <motion.div
      ref={drag}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: isUsed ? 0.3 : 1,
        y: isDragging ? -10 : 0,
      }}
      transition={{ delay: index * 0.1 }}
      className={`
        w-12 h-12 flex items-center justify-center 
        rounded-lg font-bold text-2xl uppercase select-none
        ${
          isCorrect
            ? "bg-green-200 text-green-800 cursor-default"
            : isUsed
              ? "bg-gray-200 text-gray-400 cursor-default"
              : "bg-teal-400 text-white cursor-grab shadow-md hover:shadow-lg active:shadow-sm"
        }
        ${isDragging ? "opacity-50" : "opacity-100"}
        transition-all duration-200
      `}
    >
      {letter}
    </motion.div>
  )
}


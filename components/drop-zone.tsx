"use client"

import { useDrop } from "react-dnd"
import { motion } from "framer-motion"

interface DropZoneProps {
  index: number
  letter: string
  onDrop: (letter: string, sourceIndex: number) => void
  onReset: () => void
  isCorrect: boolean
}

export default function DropZone({ index, letter, onDrop, onReset, isCorrect }: DropZoneProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "letter",
    drop: (item: { letter: string; sourceIndex: number }) => {
      onDrop(item.letter, item.sourceIndex)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
    canDrop: () => !isCorrect,
  }))

  const handleClick = () => {
    if (letter && !isCorrect) {
      onReset()
    }
  }

  return (
    <motion.div
      ref={drop}
      initial={{ y: 20, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        scale: isOver ? 1.1 : 1,
      }}
      transition={{ delay: index * 0.1 }}
      onClick={handleClick}
      className={`
        w-12 h-12 flex items-center justify-center 
        rounded-lg text-2xl font-bold uppercase
        border-2 transition-all duration-200
        ${
          letter
            ? isCorrect
              ? "bg-green-500 text-white border-green-600"
              : "bg-blue-500 text-white border-blue-600 cursor-pointer"
            : "bg-gray-100 border-dashed border-gray-300"
        }
        ${isOver && canDrop ? "bg-blue-100 border-blue-500" : ""}
      `}
    >
      {letter}
    </motion.div>
  )
}


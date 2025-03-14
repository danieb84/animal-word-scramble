import WordScrambleGame from "@/components/word-scramble-game"
import { CatSvg } from "@/components/cat-svg"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-teal-800 mb-2">Animal Word Scramble</h1>
          <p className="text-lg text-gray-600">Drag and drop the letters to spell each animal name!</p>
        </header>
        <CatSvg />
        <WordScrambleGame />
      </div>
    </main>
  )
}


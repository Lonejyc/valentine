import { useState } from 'react'
import Button from './components/Button'
import Letter from './components/Letter'

function App() {
  const [buttonSize, setButtonSize] = useState(1)
  const [button2Size, setButton2Size] = useState(1)
  const [isOpen, setIsOpen] = useState(false)

  const handleGrowButton = () => {
    setButtonSize(buttonSize * 1.6)
    setButton2Size(button2Size / 1.2)
  }

  return (
    <>
    <main className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-valentine-pink to-valentine-dark">
      <div className={`absolute inset-0 flex flex-col justify-center items-center gap-8 transition-all duration-700 ease-[linear(0,1.20,0.85,1.10,1)] z-10 ${isOpen ? 'translate-y-[200px] scale-0 opacity-0' : ''}`}>
        <h1 className="text-center text-7xl font-black font-peridot [text-shadow:0_7px_17.1px_rgba(0,0,0,0.25)]">Veux-tu être ma valentine ?</h1>
        <div className="flex justify-center items-center gap-4">
            <Button name="OUI !" size={buttonSize} onClick={() => setIsOpen(true)}></Button>
            <Button name="NON." size={button2Size} onClick={handleGrowButton}></Button>
        </div>
      </div>
      <div className="absolute inset-0 flex justify-center items-center">
        <Letter isOpen={isOpen}/>
      </div>
    </main>
    </>
  )
}

export default App

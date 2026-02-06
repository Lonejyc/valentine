import { useState } from 'react'
import Button from './components/Button'

function App() {
  const [buttonSize, setButtonSize] = useState(1)

  const handleGrowButton = () => {
    setButtonSize(buttonSize * 2)
  }

  return (
    <>
    <main className="flex flex-col justify-center items-center h-screen gap-4">
      <h1 className="text-center text-4xl font-bold font-peridot">Veux-tu être ma valentine ?</h1>
      <div className="flex justify-center items-center gap-4">
          <Button name="OUI" size={buttonSize}></Button>
          <Button name="NON" onClick={handleGrowButton}></Button>
      </div>
    </main>
    </>
  )
}

export default App

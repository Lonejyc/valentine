import { useEffect, useState } from 'react'
import Button from './components/Button'
import Letter from './components/Letter'
import { useProposal } from './hooks/useProposal'

function App() {
  const { 
    yesButtonSize, 
    noButtonSize, 
    isOpen, 
    setIsOpen,
    handleAccept, 
    handleRefusal 
  } = useProposal()

  const [question, setQuestion] = useState("Veux-tu être ma valentine ?")
  const [customAnswer, setCustomAnswer] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [hasId, setHasId] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Default values for editing
  const DEFAULT_QUESTION = "Veux-tu être ma valentine ?"
  const DEFAULT_ANSWER = "Rendez-vous le 14 février aux Parcellaires à 21h.\n07 61 48 34 78"

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const id = searchParams.get('id')
    
    if (id) {
      setHasId(true)
      fetch(`http://localhost:3000/api/get/${id}`)
        .then(res => {
          if (res.ok) return res.json()
          throw new Error('Not found')
        })
        .then(data => {
          setQuestion(data.question)
          setCustomAnswer(data.answer)
        })
        .catch(err => {
          console.error("Failed to fetch custom valentine:", err)
        })
    }
  }, [])

  const startEditing = () => {
    setIsEditing(true)
    setIsOpen(false) // Show question first
    // Pre-fill with defaults if empty
    if (!customAnswer) setCustomAnswer(DEFAULT_ANSWER)
    if (question === DEFAULT_QUESTION) setQuestion(DEFAULT_QUESTION)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setGeneratedLink(null)
    setQuestion(DEFAULT_QUESTION)
    setCustomAnswer(null)
    setIsOpen(false)
    // Reload to clear state completely if needed, but setState is cleaner
    // window.location.reload() 
  }

  const createLink = async () => {
    if (!question || !customAnswer) return

    try {
      const res = await fetch('http://localhost:3000/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer: customAnswer })
      })
      
      if (!res.ok) throw new Error('Erreur lors de la création')
      
      const data = await res.json()
      const url = `${window.location.origin}/?id=${data.id}`
      setGeneratedLink(url)
    } catch (error) {
      alert("Une erreur est survenue lors de la création du lien.")
      console.error(error)
    }
  }

  return (
    <>
    <main className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-valentine-pink to-valentine-dark">
      <div className={`absolute inset-0 flex flex-col justify-center items-center gap-8 transition-all duration-700 ease-[linear(0,1.20,0.85,1.10,1)] z-10 ${isOpen ? 'translate-y-[200px] scale-0 opacity-0' : ''}`}>
        
        <div className="flex w-full justify-center px-4">
          {isEditing ? (
             <input
               type="text"
               value={question}
               onChange={(e) => setQuestion(e.target.value)}
               className="text-center text-7xl font-black font-peridot [text-shadow:0_7px_17.1px_rgba(0,0,0,0.25)] bg-transparent outline-none w-full max-w-5xl placeholder:text-black/30 text-white"
               placeholder="Votre question ?"
             />
          ) : (
             <h1 className="text-center text-7xl font-black font-peridot [text-shadow:0_7px_17.1px_rgba(0,0,0,0.25)] text-white">{question}</h1>
          )}
        </div>

        <div className="flex justify-center items-center gap-4">
            <Button name="OUI !" size={yesButtonSize} onClick={handleAccept}></Button>
            <Button name="NON." size={noButtonSize} onClick={handleRefusal}></Button>
        </div>
      </div>
      
      <div className="absolute inset-0 flex justify-center items-center">
        <Letter 
          isOpen={isOpen} 
          customAnswer={customAnswer} 
          isEditing={isEditing}
          onAnswerChange={setCustomAnswer}
        />
      </div>

      {/* Control Bar for Editing */}
      {isEditing && (
        <div className="absolute bottom-0 left-0 w-full bg-valentine-base-dark/95 backdrop-blur-md p-6 flex flex-col items-center gap-4 z-50 border-t border-valentine-pink/30 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
          {!generatedLink ? (
            <div className="flex flex-col md:flex-row gap-6 items-center">
               <div className="flex gap-2">
                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-valentine-card-light rounded-xl font-bold transition-all text-sm border border-white/10"
                >
                  {isOpen ? "⬅ Modifier la question" : "Modifier la réponse ➡"}
                </button>
               </div>
               <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
               <div className="flex gap-4">
                <button 
                  onClick={cancelEditing}
                  className="px-6 py-3 bg-transparent hover:bg-white/10 text-white/80 hover:text-white rounded-xl font-bold transition-all border border-white/10"
                >
                  Annuler
                </button>
                <button 
                  onClick={createLink}
                  className="px-8 py-3 bg-valentine-pink hover:bg-valentine-base text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-valentine-pink/20 hover:scale-105 active:scale-95"
                >
                  Obtenir mon lien
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 w-full max-w-xl animate-in fade-in slide-in-from-bottom-4">
              <p className="text-valentine-card-light font-bold text-lg">Votre lien est prêt !</p>
              <div className="flex w-full gap-2">
                <input 
                  readOnly 
                  value={generatedLink} 
                  className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white font-medium outline-none focus:border-valentine-pink/50 transition-colors"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLink)
                    setIsCopied(true)
                    setTimeout(() => setIsCopied(false), 2000)
                  }}
                  className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg min-w-[120px] ${
                    isCopied 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-valentine-base hover:bg-valentine-dark text-white'
                  }`}
                >
                  {isCopied ? "Copié !" : "Copier"}
                </button>
              </div>
              <button onClick={() => window.location.href = generatedLink} className="text-white/50 hover:text-white underline text-sm mt-2 transition-colors">
                Voir le résultat
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Link Button (only show if not editing AND no ID present) */}
      {!isEditing && !hasId && (
        <button 
          onClick={startEditing}
          className="absolute bottom-4 right-4 z-50 px-4 py-2 bg-white/20 hover:bg-white/40 text-valentine-base-dark text-sm rounded-lg backdrop-blur-sm transition-colors cursor-pointer font-bold"
        >
          Créer mon lien
        </button>
      )}
    </main>
    </>
  )
}

export default App

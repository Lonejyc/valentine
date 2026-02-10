import {useEffect, useState} from 'react'
import Button from './components/Button'
import Letter from './components/Letter'

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [question, setQuestion] = useState("Veux-tu être ma valentine ?")
  const [customAnswer, setCustomAnswer] = useState<string | null>(null)

  const [buttonSize, setButtonSize] = useState(1)
  const [button2Size, setButton2Size] = useState(1)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
      fetch(`${API_URL}/get/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.question) {
            setQuestion(data.question);
            setCustomAnswer(data.answer);
          }
        })
        .catch(err => console.error("Erreur chargement:", err));
    }
  }, []);

  const createCustomLink = async () => {
    const userQ = prompt("Ta question personnalisée ?");
    if (!userQ) return;

    const userA = prompt("Ta réponse (affichée après le OUI) ?");

    try {
      const res = await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQ, answer: userA })
      });

      const data = await res.json();

      if (data.success) {
        const finalUrl = `${window.location.origin}?id=${data.id}`;

        prompt("Voici ton lien unique à partager :", finalUrl);
      }
    } catch (e) {
      alert("Erreur lors de la création du lien");
      console.error(e);
    }
  }

  const handleGrowButton = () => {
    setButtonSize(buttonSize * 1.6)
    setButton2Size(button2Size / 1.2)
  }

  return (
    <>
    <main className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-valentine-pink to-valentine-dark">
      <div className={`absolute inset-0 flex flex-col justify-center items-center gap-8 transition-all duration-700 ease-[linear(0,1.20,0.85,1.10,1)] z-10 ${isOpen ? 'translate-y-[200px] scale-0 opacity-0' : ''}`}>
        <h1 className="text-center text-7xl font-black font-peridot [text-shadow:0_7px_17.1px_rgba(0,0,0,0.25)]">
          {question}
        </h1>
        <div className="flex justify-center items-center gap-4">
            <Button name="OUI !" size={buttonSize} onClick={() => setIsOpen(true)}></Button>
            <Button name="NON." size={button2Size} onClick={handleGrowButton}></Button>
        </div>
      </div>
      <div className="absolute inset-0 flex justify-center items-center">
        <Letter isOpen={isOpen}/>
      </div>
      <div className="absolute bottom-5 right-5 z-50">
        <button
          onClick={createCustomLink}
          className="bg-white/30 hover:bg-white/50 text-white font-bold py-2 px-4 rounded-full backdrop-blur-sm transition-all"
        >
          Créer ma question
        </button>
      </div>
    </main>
    </>
  )
}

export default App

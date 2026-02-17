import letter from '../assets/images/letter.svg'

const Letter = ({isOpen, customAnswer, isEditing, onAnswerChange}: {
  isOpen: boolean, 
  customAnswer?: string | null,
  isEditing?: boolean,
  onAnswerChange?: (val: string) => void
}) => {
  return (
    <div className='relative max-w-screen w-[600px] h-[25vh]'>
        <div className={`feuille flex flex-col items-center gap-6 p-6 absolute top-0 left-0 w-full h-130 bg-gradient-to-b from-valentine-card-light to-valentine-card-dark transition-all delay-100 duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? '-translate-y-0' : 'translate-y-150'} ${isEditing ? 'z-30 cursor-text' : 'z-0'}`}>
            <div className='flex justify-center items-center gap-6'>
                <span className='circle bg-valentine-base w-8 h-8 rounded-full'></span>
                <span className='circle bg-valentine-base w-8 h-8 rounded-full'></span>
                <span className='circle bg-valentine-base w-8 h-8 rounded-full'></span>
                <span className='circle bg-valentine-base w-8 h-8 rounded-full'></span>
                <span className='circle bg-valentine-base w-8 h-8 rounded-full'></span>
                <span className='circle bg-valentine-base w-8 h-8 rounded-full'></span>
                <span className='circle bg-valentine-base w-8 h-8 rounded-full'></span>
                <span className='circle bg-valentine-base w-8 h-8 rounded-full'></span>
                <span className='circle bg-valentine-base w-8 h-8 rounded-full'></span>
                <span className='circle bg-valentine-base w-8 h-8 rounded-full'></span>
            </div>
            {isEditing ? (
              <textarea
                value={customAnswer || ""}
                onChange={(e) => onAnswerChange?.(e.target.value)}
                placeholder="Écrivez votre réponse ici..."
                className="w-full h-full bg-transparent resize-none outline-none text-center text-4xl font-black font-peridot text-valentine-base placeholder:text-valentine-base/50"
              />
            ) : customAnswer ? (
              <p className='text-center text-4xl font-black font-peridot text-valentine-base whitespace-pre-wrap'>{customAnswer}</p>
            ) : (
              <>
                <p className='text-center text-4xl font-black font-peridot text-valentine-base'>Rendez-vous le 14 février aux Parcellaires à 21h.</p>
                <p className='text-center text-4xl font-black font-peridot text-valentine-base'>07 61 48 34 78</p>
              </>
            )}
        </div>
        <div className={`letter absolute top-50 left-0 w-full h-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'translate-y-0' : 'translate-y-150'} ${isEditing ? 'pointer-events-none' : ''}`}>
          <span className="right absolute left-0 top-0">
            <img src={letter} className='scale-x-[-1]' alt="letter right" />
          </span>
          <span className="left absolute left-0 top-0">
            <img src={letter} alt="letter left" />
          </span>
        </div>
      </div>
  )
}

export default Letter
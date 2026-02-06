const Button = ({name, size, onClick}: {name: string, size?: number, onClick?: () => void}) => {
  return (
    <button 
      className={`whitespace-nowrap font-black font-peridot text-7xl shadow-2xl cursor-pointer transition-all duration-700 ease-[linear(0,1.20,0.85,1.10,1)] ${name === 'OUI !' ? 'text-valentine-base bg-white hover:bg-white' : 'text-white bg-valentine-base-dark hover:bg-valentine-base-dark'}`}
      style={{ 
        fontSize: size ? `${size * 4.5}rem` : '4.5rem',
        padding: size ? `${size * 1.5}rem ${size * 2}rem` : '1.5rem 2rem',
        borderRadius: size ? `${size * 1.5}rem` : '1.5rem'
      }}
      onClick={onClick}
    >
        {name}
    </button>
  )
}

export default Button
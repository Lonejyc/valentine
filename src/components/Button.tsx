const Button = ({name, size, onClick}: {name: string, size?: number, onClick?: () => void}) => {
  return (
    <button 
      className={`text-white font-bold font-peridot border-2 cursor-pointer transition-all duration-300 ease-in-out ${name === 'OUI' ? 'bg-rose-500 hover:bg-rose-600 border-rose-600' : 'bg-gray-500 hover:bg-gray-600 border-gray-600'}`}
      style={{ 
        fontSize: size ? `${size}rem` : '1rem',
        padding: size ? `${size * 0.5}rem ${size * 1.5}rem` : '0.5rem 1.5rem',
        borderRadius: size ? `${size * 0.7}rem` : '0.7rem'
      }}
      onClick={onClick}
    >
        {name}
    </button>
  )
}

export default Button
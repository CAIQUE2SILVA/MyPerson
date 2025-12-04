import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="app-header">
        <h1>MyPerson - Frontend</h1>
        <p>Bem-vindo ao frontend React com Vite e TypeScript</p>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Contador: {count}
          </button>
          <p>
            Edite <code>src/App.tsx</code> e salve para testar o HMR
          </p>
        </div>
      </header>
    </div>
  )
}

export default App


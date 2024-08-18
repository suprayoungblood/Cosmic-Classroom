import { useState } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.post('http://localhost:3000/api/ask', { question })
      setAnswer(response.data.answer)
    } catch (error) {
      console.error('Error asking question:', error)
      setAnswer('Sorry, there was an error processing your question. Please try again.')
    }
    setIsLoading(false)
  }

  return (
    <>
      <h1>Space Explorer AI</h1>
      <div className="card">
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about space..."
            className="w-full p-2 border rounded"
          />
          <button type="submit" disabled={isLoading} className="mt-2 p-2 bg-blue-500 text-white rounded">
            {isLoading ? 'Thinking...' : 'Ask Question'}
          </button>
        </form>
        {answer && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h2 className="font-bold">Answer:</h2>
            <p>{answer}</p>
          </div>
        )}
      </div>
      <p className="read-the-docs mt-4">
        Explore the cosmos! Ask anything about planets, galaxies, black holes, or space exploration.
      </p>
    </>
  )
}

export default App
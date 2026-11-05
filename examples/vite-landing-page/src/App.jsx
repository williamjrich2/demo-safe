import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

function App() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Example Company Growth System</p>
        <h1>Book more consultations for Example Company</h1>
        <p>Talk to Jane Client at jane@client.com or call (404) 555-0199.</p>
        <a href="https://client.example/private-intake">Start intake</a>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)

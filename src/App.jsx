import { Routes, Route } from 'react-router'
import './App.css'
import Main from './pages/Main'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Main/>}/>
    </Routes>
  )
}

export default App

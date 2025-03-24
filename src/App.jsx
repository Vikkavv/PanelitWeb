import { Routes, Route } from 'react-router'
import './App.css'
import Main from './pages/Main'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Main/>}/>
      <Route path='/signUp' element={<SignUp/>}/>
      <Route path='/signIn' element={<SignIn/>}/>
    </Routes>
  )
}

export default App

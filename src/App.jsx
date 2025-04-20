import { Routes, Route } from 'react-router'
import './App.css'
import Main from './pages/Main'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Worksapce from './pages/WorkSpace'
import Panel from './pages/Panel'
import EditUserProfile from './pages/EditUserProfile'
import UpdatePlan from './pages/UpdatePlan'
import UserProfile from './pages/UserProfile'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Main/>}/>
      <Route path='/signUp' element={<SignUp/>}/>
      <Route path='/signIn' element={<SignIn/>}/>
      <Route path='/workspace' element={<Worksapce/>}/>
      <Route path='/Panel/:id' element={<Panel/>}/>
      <Route path='/EditUserProfile' element={<EditUserProfile/>}/>
      <Route path='/UpdatePlan' element={<UpdatePlan/>}/>
      <Route path='/UserProfile/:id' element={<UserProfile/>}/>
    </Routes>
  )
}

export default App

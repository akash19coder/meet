import VideoCall from "./Pages/VideoCall"
import Lobby from './Pages/Lobby'
import { Routes, BrowserRouter, Route } from "react-router-dom"
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<Lobby/>}></Route>
        <Route path="/:id" element={<VideoCall/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

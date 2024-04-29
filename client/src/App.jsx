import VideoCall from "./Pages/VideoCall"
import { Routes, BrowserRouter, Route } from "react-router-dom"
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:id" element={<VideoCall/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

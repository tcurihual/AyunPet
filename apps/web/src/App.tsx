import { BrowserRouter } from "react-router-dom"
import WebRouter from "./pages/router"

export default function App() {
  return (
    <BrowserRouter>
      <WebRouter />
    </BrowserRouter>
  )
}

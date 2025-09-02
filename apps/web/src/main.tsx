import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "./index.css"
import WebRouter from "./pages/router"
import { AuthProvider } from "./contexts/AuthContext"

const root = ReactDOM.createRoot(document.getElementById("root")!)

root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WebRouter />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)

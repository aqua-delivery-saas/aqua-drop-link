import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { useAuth } from "@/hooks/useAuth";

// Inicializar autenticação antes de renderizar a aplicação
useAuth.getState().initialize();

createRoot(document.getElementById("root")!).render(<App />);

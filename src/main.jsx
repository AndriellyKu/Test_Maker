import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Cadastro from './pages/Cadastro/Cadastro.jsx';
import AlunoHome from './pages/Home/AlunoHome.jsx';
import ProfessorHome from './pages/Home/ProfessorHome.jsx'; // Importando ProfessorHome
import Maker from './pages/Maker/Maker.jsx';
import SalaProfessor from './pages/Sala/SalaProfessor.jsx';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/cadastro", 
    element: <Cadastro/>
  },
  {
    path: "/alunoHome", // Caminho pra pagina que aparece no navegador
    element: <AlunoHome/> // O nome do componente real
  },
  {
    path: "/professorHome",
    element: <ProfessorHome/> 
  },
  {
    path:"/maker",
    element: <Maker/>
  },
  {
    path:"/salaprofessor",
    element: <SalaProfessor/>
  },
  {

  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);

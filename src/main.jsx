import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Cadastro from './pages/Cadastro/Cadastro.jsx';
import AlunoHome from './pages/Home/AlunoHome.jsx';
import ProfessorHome from './pages/Home/ProfessorHome.jsx'; 
import Maker from './pages/Maker/Maker.jsx';
import SalaProfessor from './pages/Sala/SalaProfessor.jsx';
import Resultadosprovamaker from './pages/Resultadosprovamaker/Resultadosprovamaker.jsx'

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
    path: "/alunoHome",
    element: <AlunoHome/> 
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
    path:"/resultadosprovamaker",
    element:<Resultadosprovamaker/>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);

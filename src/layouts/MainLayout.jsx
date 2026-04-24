import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-dentista-background">
      {/* 1. SIDEBAR FIXA 
          Ela ocupa o lado esquerdo e não recarrega quando mudamos de página.
      */}
      <Sidebar />

      {/* 2. CONTAINER PRINCIPAL 
          Ocupa o resto da tela (flex-1) e permite scroll apenas aqui dentro (overflow-y-auto).
      */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* O Outlet é o "espaço reservado". 
            Se a rota for "/dashboard", ele carrega o Dashboard.
            Se for "/pacientes", ele carrega a lista de pacientes.
        */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
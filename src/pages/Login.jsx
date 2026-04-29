import React, { useState } from "react";
import { LogIn, Lock, Mail } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { fazerLogin } from "../services/authService";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth(); // Função que salva o token no Contexto
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setCarregando(true);

    // Agora usamos o Service que criamos
    const resultado = await fazerLogin(email, senha, login);

    if (resultado.error) {
      // Se houver erro, mostramos a mensagem que veio do Service
      alert(resultado.message);
      setCarregando(false);
    } else {
      // Sucesso! O Contexto já salvou e decodificou o token.
      // Agora podemos navegar para a Dashboard
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white font-sans">
      
      {/* Lado Esquerdo: Imagem com Gradiente */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2070" 
          alt="Clínica Odontológica" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-dentista-primary/90 to-dentista-secondary/40 flex flex-col justify-end p-16">
          <h2 className="text-4xl font-bold text-white mb-4">OdontoTrack</h2>
          <p className="text-white/80 text-xl max-w-md">
            A gestão inteligente da sua clínica na palma da sua mão.
          </p>
        </div>
      </div>

      {/* Lado Direito: Formulário */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-dentista-title mb-2">Bem-vindo de volta</h1>
            <p className="text-dentista-body opacity-70">Entre com suas credenciais para acessar o sistema.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Input
                label="E-mail Corporativo"
                type="email"
                placeholder="exemplo@odontotrack.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="absolute right-4 bottom-3.5 text-gray-400" size={20} />
            </div>

            <div className="relative">
              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <Lock className="absolute right-4 bottom-3.5 text-gray-400" size={20} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-dentista-body">
                <input type="checkbox" className="rounded border-gray-300 text-dentista-primary focus:ring-dentista-primary" />
                Lembrar de mim
              </label>
              <a href="#" className="text-dentista-primary font-semibold hover:underline">Esqueceu a senha?</a>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-4 text-lg" 
              icon={LogIn}
              disabled={carregando}
            >
              {carregando ? "Autenticando..." : "Entrar no Sistema"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-dentista-body opacity-60">
            © 2026 OdontoTrack. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
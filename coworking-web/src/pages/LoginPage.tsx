import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      navigate('/explorar');
    } catch {
      toast.error('Credenciales invalidas');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#101215] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#d8d8d8] bg-white p-8 text-neutral-900 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">Nido</h1>
          <p className="mt-1 text-sm text-neutral-500">Encuentra tu espacio de trabajo ideal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="email">
              Correo electronico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="password">
              Contrasena
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
          >
            {isSubmitting ? 'Ingresando...' : 'Iniciar sesion'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          No tienes cuenta?{' '}
          <Link to="/registro" className="font-medium text-neutral-900 hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}

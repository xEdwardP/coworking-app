import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await signUp(name, email, password);
      navigate('/explorar');
    } catch {
      toast.error('No se pudo crear la cuenta. El correo ya esta registrado?');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#101215] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#d8d8d8] bg-white p-8 text-neutral-900 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">Crea tu cuenta</h1>
          <p className="mt-1 text-sm text-neutral-500">Unete a Nido en segundos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="name">
              Nombre completo
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900"
            />
          </div>

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
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-neutral-900 hover:underline">
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  );
}

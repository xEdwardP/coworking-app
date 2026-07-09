import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
// import { Layout } from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// import ExplorarPage from './pages/ExplorarPage';
// import SpaceDetailPage from './pages/SpaceDetailPage';
// import MisReservasPage from './pages/MisReservasPage';
// import FavoritosPage from './pages/FavoritosPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            {/* <Route element={<Layout />}>
              <Route path="/explorar" element={<ExplorarPage />} />
              <Route path="/espacios/:id" element={<SpaceDetailPage />} />
              <Route path="/mis-reservas" element={<MisReservasPage />} />
              <Route path="/favoritos" element={<FavoritosPage />} />
            </Route> */}
          </Route>

          <Route path="*" element={<Navigate to="/explorar" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/admin/Dashboard';
import EmpleadoDashboard from '../pages/EmpleadoDashboard';
import Categorias from '../pages/Categorias';
import Ingredientes from '../pages/Ingredientes';
import Productos from '../pages/Productos';
import Pedidos from '../pages/Pedidos';
import Usuarios from '../pages/Usuarios';
import Estadisticas from '../pages/Estadisticas';
import Login from '../pages/Login';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* Employee routes */}
          <Route
            path="/empleado"
            element={
              <ProtectedRoute roles={['PEDIDOS', 'STOCK']}>
                <EmpleadoDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/empleado"
            element={
              <ProtectedRoute roles={['PEDIDOS', 'STOCK']}>
                <EmpleadoDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pedidos"
            element={
              <ProtectedRoute roles={['ADMIN', 'PEDIDOS']}>
                <Pedidos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categorias"
            element={
              <ProtectedRoute requireAuth>
                <Categorias />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute requireAuth>
                <Productos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ingredientes"
            element={
              <ProtectedRoute requireAuth>
                <Ingredientes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <Usuarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/estadisticas"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <Estadisticas />
              </ProtectedRoute>
            }
          />

          {/* Legacy admin redirects */}
          <Route path="/productos" element={<ProtectedRoute requireAuth><Productos /></ProtectedRoute>} />
          <Route path="/categorias" element={<ProtectedRoute requireAuth><Categorias /></ProtectedRoute>} />
          <Route path="/ingredientes" element={<ProtectedRoute requireAuth><Ingredientes /></ProtectedRoute>} />
          <Route path="/pedidos" element={<ProtectedRoute requireAuth><Pedidos /></ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute roles={['ADMIN']}><Usuarios /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

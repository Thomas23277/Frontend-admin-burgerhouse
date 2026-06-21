import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../features/admin/Dashboard';
import EmpleadoDashboard from '../features/employee/EmpleadoDashboard';
import Categorias from '../features/products/Categorias';
import Ingredientes from '../features/products/Ingredientes';
import Productos from '../features/products/Productos';
import Pedidos from '../features/orders/Pedidos';
import Usuarios from '../features/users/Usuarios';
import Estadisticas from '../features/stats/Estadisticas';
import Login from '../features/auth/Login';

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

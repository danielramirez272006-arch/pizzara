import React, { useState } from 'react';
import { useToast } from '../../shared/context/toast-context';

export const AdminUsuariosPage = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState([
    { id: 1, name: 'Prof. Carlos Rivera', email: 'carlos@docente.com', role: 'admin', status: 'Activo', courses: 4 },
    { id: 2, name: 'Dra. Elena Vega', email: 'elena@pizarras.com', role: 'usuario', status: 'Activo', courses: 2 },
    { id: 3, name: 'Mtro. Fernando Soto', email: 'fernando@educa.com', role: 'usuario', status: 'Inactivo', courses: 1 },
    { id: 4, name: 'Lic. Sofia Morales', email: 'sofia@didactica.org', role: 'usuario', status: 'Activo', courses: 3 },
  ]);

  const toggleRole = (id) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newRole = u.role === 'admin' ? 'usuario' : 'admin';
          addToast(`Rol de ${u.name} cambiado a "${newRole}"`, 'info');
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  return (
    <div className="page admin-usuarios-page">
      <div className="container">
        <div className="admin-header">
          <div className="admin-title">
            <span className="badge-admin">👑 Panel Exclusivo de Administración</span>
            <h2>Gestión de Docentes y Usuarios</h2>
            <p>Administra permisos de acceso a cursos avanzados y licencias de pizarras interactivas.</p>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Docente</th>
                <th>Correo Electrónico</th>
                <th>Rol de Sistema</th>
                <th>Cursos Activos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="user-name-cell">
                    <strong>{u.name}</strong>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-pill ${u.role === 'admin' ? 'pill-admin' : 'pill-user'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>{u.courses} Cursos</td>
                  <td>
                    <span className={`status-pill ${u.status === 'Activo' ? 'status-online' : 'status-offline'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => toggleRole(u.id)} className="btn-table-action">
                      Cambiar a {u.role === 'admin' ? 'Usuario' : 'Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

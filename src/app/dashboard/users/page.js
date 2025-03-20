// src/app/dashboard/users/page.js
"use client";
import { useState, useEffect, useCallback } from "react";
import withRole from "@lib/withRole";
import { useSession } from "next-auth/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

function Users() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Estado para el formulario de creación de usuario
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER",
  });

  // Estados para edición de usuario (edición inline en la tabla)
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUser, setEditingUser] = useState({
    name: "",
    email: "",
    password: "", // Campo opcional para cambiar contraseña
    role: "",
  });

  // Usamos useDisclosure para controlar el modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Función para obtener la lista de usuarios
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Error cargando usuarios");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Función para crear un usuario; se llamará desde el modal.
  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      setMessage("Todos los campos son obligatorios");
      return;
    }
    if (!validateEmail(newUser.email)) {
      setMessage("Por favor, introduce un email válido");
      return;
    }
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error("Error creando usuario");
      await res.json();
      setMessage("Usuario creado con éxito");
      setNewUser({ name: "", email: "", password: "", role: "MEMBER" });
      fetchUsers();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const startEditUser = (user) => {
    setEditingUserId(user.id);
    setEditingUser({
      name: user.name,
      email: user.email,
      password: "", // Campo para cambiar contraseña (opcional)
      role: user.role,
    });
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditingUser({ name: "", email: "", password: "", role: "" });
  };

  const handleEditUser = async (id) => {
    if (!editingUser.name || !editingUser.email || !editingUser.role) {
      setMessage("Los campos nombre, email y rol son obligatorios");
      return;
    }
    if (!validateEmail(editingUser.email)) {
      setMessage("Por favor, introduce un email válido");
      return;
    }
    try {
      // Si se ingresó una nueva contraseña, se incluye en el payload
      const payload = {
        id,
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      };
      if (editingUser.password.trim() !== "") {
        payload.password = editingUser.password;
      }
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error actualizando usuario");
      await res.json();
      setMessage("Usuario actualizado con éxito");
      cancelEdit();
      fetchUsers();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Error eliminando usuario");
      const result = await res.json();
      setMessage(result.message || "Usuario eliminado");
      fetchUsers();
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Limpieza del mensaje de notificación
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}

      {/* Botón que abre el modal usando useDisclosure */}
      <Button onPress={onOpen} variant="primary" className="mb-4">
        Nuevo Usuario
      </Button>

      {/* Modal centrado sobre la página */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                <ModalHeader>Crear Nuevo Usuario</ModalHeader>
                <ModalBody>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="border p-2 rounded w-full mb-2"
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                    <option value="MEMBER">MEMBER</option>
                  </select>
                </ModalBody>
                <ModalFooter>
                  <Button
                    onPress={async () => {
                      await handleCreateUser();
                      onClose();
                    }}
                    variant="success"
                  >
                    Crear Usuario
                  </Button>
                  <Button onPress={onClose} variant="secondary">
                    Cancelar
                  </Button>
                </ModalFooter>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Tabla de usuarios */}
      <Table
        aria-label="Gestión de Usuarios"
        className="text-foreground rounded shadow justify-center align-center rounded-2xl"
      >
        <TableHeader>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Rol</TableColumn>
          <TableColumn>Contraseña</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  user.name
                )}
              </TableCell>
              <TableCell>
                {editingUserId === user.id ? (
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  user.email
                )}
              </TableCell>
              <TableCell>
                {editingUserId === user.id ? (
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value })
                    }
                    className="border p-1 rounded"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                    <option value="MEMBER">MEMBER</option>
                  </select>
                ) : (
                  user.role
                )}
              </TableCell>
              <TableCell>
                {editingUserId === user.id ? (
                  <input
                    type="password"
                    placeholder="Nueva contraseña (opcional)"
                    value={editingUser.password}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        password: e.target.value,
                      })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  "*******"
                )}
              </TableCell>
              <TableCell>
                {editingUserId === user.id ? (
                  <>
                    <Button
                      variant="success"
                      onPress={() => handleEditUser(user.id)}
                    >
                      Guardar
                    </Button>
                    <Button variant="secondary" onPress={cancelEdit}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      onPress={() => startEditUser(user)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onPress={() => handleDeleteUser(user.id)}
                    >
                      Eliminar
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default withRole(Users, ["ADMIN"]);

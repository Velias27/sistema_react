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
    password: "",
    role: "",
  });

  // useDisclosure para el modal
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
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => setError("Error cargando usuarios"));
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    // Contenedor con fondo oscuro y texto claro
    <div className="p-12 bg-gray-950 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}

      {/* Botón que abre el modal usando useDisclosure */}
      <Button onPress={onOpen} variant="light" className="mb-4">
        Crear Usuario
      </Button>

      {/* Modal con fondo oscuro */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="bg-slate-900 text-white p-6 rounded shadow-lg max-w-md w-full">
                <ModalHeader className="text-xl font-bold pb-4">
                  Crear nuevo usuario
                </ModalHeader>
                <ModalBody className="gap-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="border p-2 rounded w-full mb-2 bg-slate-800 text-white"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="border p-2 rounded w-full mb-2 bg-slate-800 text-white"
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="border p-2 rounded w-full mb-2 bg-slate-800 text-white"
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="border p-2 rounded w-full bg-slate-800 text-white mb-2"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                    <option value="MEMBER">MEMBER</option>
                  </select>
                </ModalBody>
                <ModalFooter className="flex justify-end p-3">
                  <Button onPress={onClose} variant="faded">
                    Cancelar
                  </Button>
                  <Button
                    onPress={async () => {
                      await handleCreateUser();
                      onClose();
                    }}
                    variant="success"
                  >
                    Confirmar
                  </Button>
                </ModalFooter>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Tabla de usuarios*/}
      <Table
        aria-label="Gestión de Usuarios"
        className="text-foreground rounded shadow justify-center align-center rounded-2xl bg-gray-900"
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
                    className="border p-1 rounded bg-slate-600 text-white"
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
                    className="border p-1 rounded bg-slate-600 text-white"
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
                    className="border p-1 rounded bg-slate-600 text-white"
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
                    className="border p-1 rounded bg-slate-600 text-white"
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

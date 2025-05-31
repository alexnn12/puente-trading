'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Verificar si es admin
        if (parsedUser.rol !== 'admin') {
          router.push('/dashboard');
          return;
        }
      } else {
        router.push('/');
        return;
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/');
          return;
        }

        const response = await fetch('/api/usuario/listado', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUsuarios(data.usuarios || []);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al cargar usuarios');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error de conexión. Intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.rol === 'admin') {
      fetchUsuarios();
    }
  }, [user, router]);

  const toggleUserStatus = async (userId, currentStatus) => {
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/usuario/status/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          activo: currentStatus === null ? 1 : (currentStatus ? 0 : 1),
          userId: userId 
        })
      });

      if (response.ok) {
        setUsuarios(usuarios.map(usuario => 
          usuario.id === userId 
            ? { ...usuario, activo: !currentStatus }
            : usuario
        ));
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión. Intenta nuevamente.');
    }
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (user?.rol !== 'admin') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Administrar Usuarios</h1>
        <Button onClick={() => router.push('/dashboard/perfil')}>
          Volver al Perfil
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <div className="space-y-2">
            <Label htmlFor="search">Buscar usuarios</Label>
            <Input
              id="search"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Registro</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.nombre}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <Badge variant={usuario.rol === 'admin' ? 'default' : 'secondary'}>
                      {usuario.rol === 'admin' ? 'Administrador' : 'Usuario'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={usuario.activo ? 'default' : 'destructive'}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(usuario.creado_en).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleUserStatus(usuario.id, usuario.activo)}
                      disabled={usuario.id === user?.id}
                    >
                      {usuario.activo ? 'Desactivar' : 'Activar'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredUsuarios.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda.' : 'No hay usuarios registrados.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

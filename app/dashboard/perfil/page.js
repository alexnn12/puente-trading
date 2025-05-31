'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PerfilPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No se encontró token de autenticación');
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/usuario', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al cargar los datos del usuario');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error de conexión. Intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Mi Perfil</CardTitle>
          <CardDescription>
            Información de tu cuenta y configuración personal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={user?.nombre || ''}
                readOnly
                className="bg-gray-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ''}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rol">Rol</Label>
              <div className="flex items-center">
                <Badge variant={user?.rol === 'admin' ? 'default' : 'secondary'}>
                  {user?.rol === 'admin' ? 'Administrador' : 'Usuario'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estado">Estado de la cuenta</Label>
              <div className="flex items-center">
                <Badge variant={user?.activo ? 'default' : 'destructive'}>
                  {user?.activo ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creado">Miembro desde</Label>
            <Input
              id="creado"
              value={user?.creado_en ? new Date(user.creado_en).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : ''}
              readOnly
              className="bg-gray-50"
            />
          </div>

          {user?.rol === 'admin' && (
            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-3">Panel de Administración</h3>
              <Link href="/dashboard/perfil/usuarios"> 
                <Button variant="outline" className="w-full">
                  Administrar Usuarios
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

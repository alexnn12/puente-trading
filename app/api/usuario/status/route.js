import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function PATCH(request) {
    const { activo, userId } = await request.json();
    console.log('userId:', userId);
    console.log('activo:', activo);
  try {
    
    // Verificar token de autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Verificar que el usuario sea admin
      if (decoded.rol !== 'admin') {
        return NextResponse.json(
          { message: 'Acceso denegado. Se requieren permisos de administrador.' },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      );
    }

    
    // Validar userId
    if (!userId ) {
      return NextResponse.json(
        { message: 'ID de usuario inválido' },
        { status: 400 }
      );
    }

   


    // Verificar que el usuario existe
    const usuarioExistente = await prisma.usuarios.findUnique({
      where: { id: userId }
    });

    if (!usuarioExistente) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el estado del usuario
    const usuarioActualizado = await prisma.usuarios.update({
      where: { id: userId },
      data: { activo },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        creado_en: true
      }
    });

    return NextResponse.json({
      usuario: usuarioActualizado,
      message: `Usuario ${activo ? 'activado' : 'desactivado'} exitosamente`
    });

  } catch (error) {
    console.error('Error al actualizar estado del usuario:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

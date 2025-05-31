import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request) {
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

    // Obtener listado de usuarios con Prisma
    const usuarios = await prisma.usuarios.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        creado_en: true
      },
      orderBy: {
        creado_en: 'desc'
      }
    });

    return NextResponse.json({
      usuarios: usuarios,
      message: 'Usuarios obtenidos exitosamente'
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


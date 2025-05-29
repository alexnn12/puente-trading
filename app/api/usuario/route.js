import jwt from 'jsonwebtoken';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { message: "Token no proporcionado" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Buscar el usuario en la base de datos
      const user = await prisma.usuarios.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          nombre: true,
          email: true,
          rol: true,
          activo: true,
          creado_en: true
        }
      });

      if (!user) {
        return Response.json(
          { message: "Usuario no encontrado" },
          { status: 404 }
        );
      }

      if (!user.activo) {
        return Response.json(
          { message: "Cuenta desactivada" },
          { status: 403 }
        );
      }

      return Response.json(
        { user },
        { status: 200 }
      );

    } catch (jwtError) {
      return Response.json(
        { message: "Token inválido" },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Error en GET usuario:', error);
    return Response.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

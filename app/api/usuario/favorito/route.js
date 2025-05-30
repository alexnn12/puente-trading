import { PrismaClient } from '@/lib/generated/prisma';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// POST - Agregar favorito
export async function POST(request) {
  try {
    const { simbolo } = await request.json();
    
    if (!simbolo) {
      return Response.json(
        { message: "Symbol is required" },
        { status: 400 }
      );
    }

    // Obtener token del header Authorization
    const authHeader = request.headers.get('authorization');
    console.log(authHeader);
    /*
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { message: "Token de autorización requerido" },
        { status: 401 }
      );
    }
      */

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario_id = decoded.userId;
      console.log(usuario_id);

      // Insertar favorito en la base de datos
      const favorito = await prisma.favoritos.create({
        data: {
          usuario_id,
          simbolo
        }
      });

      return Response.json(
        { 
          message: "Favorito agregado exitosamente",
          data: favorito
        },
        { status: 201 }
      );
      
    } catch (jwtError) {
      return Response.json(
        { message: "Token inválido" },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Error adding favorite:', error);
    
    // Manejar error de duplicado
    if (error.code === 'P2002') {
      return Response.json(
        { message: "Este símbolo ya está en tus favoritos" },
        { status: 409 }
      );
    }
    
    return Response.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Quitar favorito
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const simbolo = searchParams.get('simbolo');
    
    if (!simbolo) {
      return Response.json(
        { message: "Symbol parameter is required" },
        { status: 400 }
      );
    }

    // Obtener token del header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { message: "Token de autorización requerido" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario_id = decoded.userId;

      // Eliminar favorito de la base de datos
      const favorito = await prisma.favoritos.deleteMany({
        where: {
          usuario_id,
          simbolo
        }
      });

      if (favorito.count === 0) {
        return Response.json(
          { message: "Favorito no encontrado" },
          { status: 404 }
        );
      }

      return Response.json(
        { 
          message: "Favorito eliminado exitosamente",
          data: { simbolo }
        },
        { status: 200 }
      );
      
    } catch (jwtError) {
      return Response.json(
        { message: "Token inválido" },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Error removing favorite:', error);
    return Response.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET - Obtener favoritos del usuario
export async function GET(request) {
  try {
    // Obtener token del header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { message: "Token de autorización requerido" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario_id = decoded.userId;

      // Obtener favoritos del usuario
      const favoritos = await prisma.favoritos.findMany({
        where: {
          usuario_id
        },
        orderBy: {
          creado_en: 'desc'
        }
      });

      return Response.json(
        { 
          message: "Favoritos obtenidos exitosamente",
          data: favoritos
        },
        { status: 200 }
      );
      
    } catch (jwtError) {
      return Response.json(
        { message: "Token inválido" },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return Response.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

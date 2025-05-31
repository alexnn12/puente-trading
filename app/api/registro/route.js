import { PrismaClient } from '@/lib/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { nombre, email, password } = await request.json();

    // Validaciones del servidor
    const errors = {};

    // Validar nombre
    if (!nombre || nombre.trim().length < 2) {
      errors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = "El email no es válido";
    }

    // Validar contraseña
    if (!password || password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (Object.keys(errors).length > 0) {
      return Response.json({ errors }, { status: 400 });
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.usuarios.findUnique({
      where: { email }
    });

    if (existingUser) {
      return Response.json(
        { errors: { email: "Este email ya está registrado" } },
        { status: 400 }
      );
    }

    // Hashear la contraseña
    const saltRounds = 12;
    const contrasena_hash = await bcrypt.hash(password, saltRounds);

    // Crear el usuario
    const newUser = await prisma.usuarios.create({
      data: {
        nombre: nombre.trim(),
        email: email.toLowerCase(),
        contrasena_hash,
        activo: 0
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        creado_en: true
      }
    });

    return Response.json(
      { 
        message: "Usuario registrado exitosamente",
        user: newUser
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error en registro:', error);
    return Response.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

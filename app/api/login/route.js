import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validaciones del servidor
    const errors = {};

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

    // Buscar el usuario en la base de datos
    const user = await prisma.usuarios.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return Response.json(
        { errors: { email: "Email o contraseña incorrectos" } },
        { status: 401 }
      );
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.contrasena_hash);

    if (!isPasswordValid) {
      return Response.json(
        { errors: { password: "Email o contraseña incorrectos" } },
        { status: 401 }
      );
    }

    // Verificar si el usuario está activo
    if (!user.activo) {
      return Response.json(
        { errors: { general: "Tu cuenta aún no ha sido activada. Contacta al administrador." } },
        { status: 403 }
      );
    }

    // Crear el JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol
      },
      process.env.JWT_SECRET ,
      { expiresIn: '7d' }
    );

    // Datos del usuario para la respuesta (sin contraseña)
    const userData = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      creado_en: user.creado_en
    };

    return Response.json(
      { 
        message: "Login exitoso",
        user: userData,
        token
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en login:', error);
    return Response.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

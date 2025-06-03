-- This database schema was generated from Prisma migrations
-- CreateTable
CREATE TABLE "favoritos" (
    "id" SERIAL NOT NULL,
    "usuario_id" UUID NOT NULL,
    "simbolo" TEXT NOT NULL,
    "creado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena_hash" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'usuario',
    "creado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" INTEGER,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acciones" (
    "simbolo" TEXT NOT NULL,
    "global_quote" TEXT,
    "time_series_daily" TEXT,
    "actualizado" TIMESTAMP(6),

    CONSTRAINT "acciones_pkey" PRIMARY KEY ("simbolo")
);

-- CreateIndex
CREATE UNIQUE INDEX "favoritos_unicos" ON "favoritos"("usuario_id", "simbolo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "fk_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

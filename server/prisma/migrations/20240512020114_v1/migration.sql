/*
  Warnings:

  - The primary key for the `Casa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `adeudo` on the `Casa` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Casa` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Casa` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Casa` table. All the data in the column will be lost.
  - The primary key for the `Servicio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `casaId` on the `Servicio` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Servicio` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Servicio` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Servicio` table. All the data in the column will be lost.
  - You are about to drop the `Inquilino` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[num_casa_fk]` on the table `Servicio` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `calle` to the `Casa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `num_casa` to the `Casa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `num_habitantes` to the `Casa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono1` to the `Casa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono2` to the `Casa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `num_casa_fk` to the `Servicio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inquilino" DROP CONSTRAINT "Inquilino_casaId_fkey";

-- DropForeignKey
ALTER TABLE "Servicio" DROP CONSTRAINT "Servicio_casaId_fkey";

-- DropIndex
DROP INDEX "Servicio_casaId_key";

-- AlterTable
ALTER TABLE "Casa" DROP CONSTRAINT "Casa_pkey",
DROP COLUMN "adeudo",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD COLUMN     "calle" VARCHAR(255) NOT NULL,
ADD COLUMN     "num_casa" INTEGER NOT NULL,
ADD COLUMN     "num_habitantes" SMALLINT NOT NULL,
ADD COLUMN     "telefono1" VARCHAR(12) NOT NULL,
ADD COLUMN     "telefono2" VARCHAR(12) NOT NULL,
ADD CONSTRAINT "Casa_pkey" PRIMARY KEY ("num_casa");

-- AlterTable
ALTER TABLE "Servicio" DROP CONSTRAINT "Servicio_pkey",
DROP COLUMN "casaId",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD COLUMN     "id_servicio" SERIAL NOT NULL,
ADD COLUMN     "num_casa_fk" INTEGER NOT NULL,
ADD CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id_servicio");

-- DropTable
DROP TABLE "Inquilino";

-- CreateTable
CREATE TABLE "Habitante" (
    "id_habitante" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "ap" VARCHAR(255),
    "am" VARCHAR(255),
    "num_casa_fk" INTEGER NOT NULL,

    CONSTRAINT "Habitante_pkey" PRIMARY KEY ("id_habitante")
);

-- CreateTable
CREATE TABLE "Cuota" (
    "id_cuota" SERIAL NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha_limite" TIMESTAMP(3) NOT NULL,
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "num_casa_fk" INTEGER NOT NULL,

    CONSTRAINT "Cuota_pkey" PRIMARY KEY ("id_cuota")
);

-- CreateTable
CREATE TABLE "Administrador" (
    "id_administrador" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "ap" VARCHAR(255),
    "am" VARCHAR(255),
    "usuario" VARCHAR(255) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,

    CONSTRAINT "Administrador_pkey" PRIMARY KEY ("id_administrador")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id_notificacion" SERIAL NOT NULL,
    "mensaje" VARCHAR(255) NOT NULL,
    "resuelto" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateIndex
CREATE UNIQUE INDEX "Servicio_num_casa_fk_key" ON "Servicio"("num_casa_fk");

-- AddForeignKey
ALTER TABLE "Habitante" ADD CONSTRAINT "Habitante_num_casa_fk_fkey" FOREIGN KEY ("num_casa_fk") REFERENCES "Casa"("num_casa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuota" ADD CONSTRAINT "Cuota_num_casa_fk_fkey" FOREIGN KEY ("num_casa_fk") REFERENCES "Casa"("num_casa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_num_casa_fk_fkey" FOREIGN KEY ("num_casa_fk") REFERENCES "Casa"("num_casa") ON DELETE RESTRICT ON UPDATE CASCADE;

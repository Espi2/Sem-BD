/*
  Warnings:

  - The primary key for the `Administrador` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_administrador` on the `Administrador` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Administrador" DROP CONSTRAINT "Administrador_pkey",
DROP COLUMN "id_administrador",
ALTER COLUMN "usuario" SET DATA TYPE TEXT,
ADD CONSTRAINT "Administrador_pkey" PRIMARY KEY ("usuario");

-- AlterTable
ALTER TABLE "Habitante" ADD COLUMN     "propietario" BOOLEAN NOT NULL DEFAULT false;

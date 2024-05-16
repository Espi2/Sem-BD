/*
  Warnings:

  - Added the required column `motivo` to the `Cuota` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cuota" ADD COLUMN     "motivo" TEXT NOT NULL;

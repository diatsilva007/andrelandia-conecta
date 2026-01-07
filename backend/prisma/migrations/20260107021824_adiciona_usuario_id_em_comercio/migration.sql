/*
  Warnings:

  - Added the required column `usuarioId` to the `Comercio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable

-- 1. Adiciona a coluna permitindo NULL temporariamente
ALTER TABLE "Comercio" ADD COLUMN "usuarioId" INTEGER;

-- 2. Preenche todos os comércios existentes com usuarioId = 1
UPDATE "Comercio" SET "usuarioId" = 1 WHERE "usuarioId" IS NULL;

-- 3. Torna a coluna obrigatória (NOT NULL)
ALTER TABLE "Comercio" ALTER COLUMN "usuarioId" SET NOT NULL;

-- 4. Cria a foreign key
ALTER TABLE "Comercio" ADD CONSTRAINT "Comercio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

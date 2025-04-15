-- CreateEnum
CREATE TYPE "StatusJogo" AS ENUM ('AGENDADO', 'EM_ANDAMENTO', 'FINALIZADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusInscricao" AS ENUM ('PENDENTE', 'APROVADA', 'REJEITADA');

-- CreateTable
CREATE TABLE "Equipe" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "capitao" TEXT NOT NULL,
    "aceiteRegulamento" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jogador" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "posicao" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "fotoUrl" TEXT,
    "equipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jogador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jogo" (
    "id" TEXT NOT NULL,
    "equipeCasaId" TEXT NOT NULL,
    "equipeForaId" TEXT NOT NULL,
    "golsCasa" INTEGER NOT NULL,
    "golsFora" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "local" TEXT NOT NULL,
    "status" "StatusJogo" NOT NULL DEFAULT 'AGENDADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gol" (
    "id" TEXT NOT NULL,
    "jogadorId" TEXT NOT NULL,
    "jogoId" TEXT NOT NULL,
    "minuto" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogAdmin" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InscricaoEquipe" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "capitao" TEXT NOT NULL,
    "aceiteRegulamento" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusInscricao" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InscricaoEquipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InscricaoJogador" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "posicao" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "inscricaoEquipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InscricaoJogador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipe_slug_key" ON "Equipe"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Jogador_equipeId_numero_key" ON "Jogador"("equipeId", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Jogador" ADD CONSTRAINT "Jogador_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jogo" ADD CONSTRAINT "Jogo_equipeCasaId_fkey" FOREIGN KEY ("equipeCasaId") REFERENCES "Equipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jogo" ADD CONSTRAINT "Jogo_equipeForaId_fkey" FOREIGN KEY ("equipeForaId") REFERENCES "Equipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gol" ADD CONSTRAINT "Gol_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gol" ADD CONSTRAINT "Gol_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogAdmin" ADD CONSTRAINT "LogAdmin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InscricaoJogador" ADD CONSTRAINT "InscricaoJogador_inscricaoEquipeId_fkey" FOREIGN KEY ("inscricaoEquipeId") REFERENCES "InscricaoEquipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `students` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teachers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "students";

-- DropTable
DROP TABLE "teachers";

-- CreateTable
CREATE TABLE "mentor_profiles" (
    "id" SERIAL NOT NULL,
    "experience" INTEGER,
    "job" TEXT,
    "description" TEXT,
    "portfolio" TEXT,
    "github" TEXT,
    "telegram" TEXT,
    "linkedin" TEXT,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "mentor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mentor_profiles_user_id_key" ON "mentor_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "mentor_profiles" ADD CONSTRAINT "mentor_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

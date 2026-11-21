-- CreateTable
CREATE TABLE "teachers" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photo" TEXT,
    "experience" INTEGER,
    "job" TEXT,
    "description" TEXT,
    "portfolio" TEXT,
    "github" TEXT,
    "telegram" TEXT,
    "linkedin" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teachers_phone_key" ON "teachers"("phone");

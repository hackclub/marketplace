-- CreateTable
CREATE TABLE "User" (
    "slackId" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("slackId")
);

-- CreateTable
CREATE TABLE "Task" (
    "task_id" TEXT NOT NULL,
    "task_title" TEXT NOT NULL,
    "task_description" TEXT NOT NULL,
    "is_Completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("task_id")
);

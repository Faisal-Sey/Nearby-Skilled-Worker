/*
  Warnings:

  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `user_username_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `username`,
    ADD COLUMN `lat` DOUBLE NULL,
    ADD COLUMN `long` DOUBLE NULL,
    MODIFY `email` VARCHAR(500) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_email_key` ON `user`(`email`);

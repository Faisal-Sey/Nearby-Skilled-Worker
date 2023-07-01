/*
  Warnings:

  - You are about to drop the column `coverProfile` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `coverProfile`,
    ADD COLUMN `coverPicture` VARCHAR(500) NULL;

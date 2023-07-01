-- AlterTable
ALTER TABLE `user` ADD COLUMN `deleted` TINYINT NOT NULL DEFAULT 0,
    ADD COLUMN `isVerified` TINYINT NOT NULL DEFAULT 0,
    ADD COLUMN `type` ENUM('seeker', 'hirer') NOT NULL DEFAULT 'seeker';

-- CreateTable
CREATE TABLE `admin` (
    `id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(555) NOT NULL,
    `username` VARCHAR(200) NOT NULL,
    `deleted` TINYINT NOT NULL DEFAULT 0,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    UNIQUE INDEX `admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

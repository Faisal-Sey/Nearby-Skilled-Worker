-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(555) NOT NULL,
    `username` VARCHAR(200) NOT NULL,
    `bio` LONGTEXT NULL,
    `coverProfile` VARCHAR(500) NULL,
    `email` VARCHAR(500) NULL,
    `name` VARCHAR(100) NOT NULL,
    `profilePicture` VARCHAR(500) NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

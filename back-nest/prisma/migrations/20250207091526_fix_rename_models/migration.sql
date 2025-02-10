/*
  Warnings:

  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `product`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(256) NOT NULL,
    `subtitle` VARCHAR(256) NULL,
    `description` VARCHAR(2048) NOT NULL DEFAULT 'No description available',
    `price` DOUBLE NOT NULL,
    `newPrice` DOUBLE NULL,
    `specifications` VARCHAR(2048) NOT NULL DEFAULT 'No specifications available',
    `type` VARCHAR(128) NOT NULL,
    `profileImages` JSON NOT NULL,
    `source` VARCHAR(255) NOT NULL,
    `hasDiscount` BOOLEAN NOT NULL DEFAULT false,
    `rating` DOUBLE NULL,

    UNIQUE INDEX `Product_title_key`(`title`),
    UNIQUE INDEX `Product_title_source_key`(`title`, `source`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(50) NOT NULL,
    `password` VARCHAR(256) NOT NULL,
    `role` ENUM('guest', 'user', 'admin') NOT NULL,

    UNIQUE INDEX `User_login_key`(`login`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

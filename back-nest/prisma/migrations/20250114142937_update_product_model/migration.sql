-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(256) NOT NULL,
    `subtitle` VARCHAR(256) NULL,
    `description` VARCHAR(2048) NOT NULL DEFAULT 'No description available',
    `price` DOUBLE NOT NULL,
    `newPrice` DOUBLE NULL,
    `specifications` VARCHAR(2048) NOT NULL DEFAULT 'No specifications available',
    `type` VARCHAR(128) NOT NULL,
    `profileImage` VARCHAR(1024) NULL,
    `source` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `product_title_key`(`title`),
    UNIQUE INDEX `product_title_source_key`(`title`, `source`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

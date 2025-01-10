/*
  Warnings:

  - You are about to alter the column `type` on the `product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(128)`.
  - A unique constraint covering the columns `[title]` on the table `product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `title` VARCHAR(256) NOT NULL,
    MODIFY `subtitle` VARCHAR(256) NULL,
    MODIFY `description` VARCHAR(2048) NOT NULL DEFAULT 'No description available',
    MODIFY `specifications` VARCHAR(2048) NOT NULL DEFAULT 'No specifications available',
    MODIFY `type` VARCHAR(128) NOT NULL,
    MODIFY `profileImage` VARCHAR(1024) NULL,
    MODIFY `source` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `product_title_key` ON `product`(`title`);

/*
  Warnings:

  - You are about to drop the column `profileImage` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `profileImage`,
    ADD COLUMN `profileImages` JSON NOT NULL;

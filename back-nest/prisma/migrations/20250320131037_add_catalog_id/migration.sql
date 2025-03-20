/*
  Warnings:

  - Added the required column `catalogId` to the `ScrapedCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ScrapedCategory` ADD COLUMN `catalogId` VARCHAR(191) NOT NULL;

/*
  Warnings:

  - A unique constraint covering the columns `[catalogId]` on the table `ScrapedCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ScrapedCategory_catalogId_key` ON `ScrapedCategory`(`catalogId`);

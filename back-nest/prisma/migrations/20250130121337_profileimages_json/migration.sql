/*
  Warnings:

  - Made the column `profileImage` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `profileImage` JSON NOT NULL;

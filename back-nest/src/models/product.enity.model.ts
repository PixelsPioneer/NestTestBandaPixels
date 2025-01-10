// import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
//
// @Entity()
// @Index(['title'], { unique: true })
// export class Product {
//   @PrimaryGeneratedColumn()
//   id: number;
//
//   @Column({ length: 256, unique: true })
//   title: string;
//
//   @Column({ length: 256, nullable: true })
//   subtitle: string;
//
//   @Column({ length: 2048, default: 'No description available' })
//   description: string;
//
//   @Column('float')
//   newPrice: number;
//
//   @Column({ length: 2048, default: 'No specifications available' })
//   specifications: string;
//
//   @Column({ length: 128 })
//   type: string;
//
//   @Column({ length: 1024, nullable: true })
//   profileImage: string;
//
//   @Column({ length: 255 })
//   source: string;
// }

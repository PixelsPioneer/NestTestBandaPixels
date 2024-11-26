import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  title: string;

  @Column({ length: 256, nullable: true })
  subtitle: string;

  @Column({ length: 2048, default: 'No description available' })
  description: string;

  @Column('float')
  newPrice: number;

  @Column({ length: 2048, default: 'No specifications available' })
  specifications: string;

  @Column({ length: 128 })
  type: string;

  @Column({ length: 1024, nullable: true })
  profileImage: string;

  @Column({ length: 255 })
  source: string;
}

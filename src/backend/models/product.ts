import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Length, IsEnum, IsString, IsOptional, IsNumber } from 'class-validator';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 256 })
    @Length(1, 256)
    title: string;

    @Column({ type: 'varchar', length: 256, nullable: true })
    @Length(0, 256)
    @IsOptional()
    subtitle: string | null;

    @Column({ type: 'varchar', length: 2048 })
    @Length(1, 2048)
    description: string;

    @Column({ type: 'float' })
    @IsNumber()
    price: number;

    @Column({ type: 'varchar', length: 2048, nullable: true })
    @IsOptional()
    @IsString()
    specifications: string | null;

    @Column({ type: 'varchar', length: 128 })
    @Length(1, 128)
    type: string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    @IsOptional()
    @IsString()
    profileImage: string | null;

    @Column({ type: 'enum', enum: ['ROZETKA', 'TELESMART'] })
    @IsEnum(['ROZETKA', 'TELESMART'])
    source: 'ROZETKA' | 'TELESMART';

    constructor(
        title: string,
        subtitle: string | null = null,
        description: string,
        price: number,
        specifications: string | null = null,
        type: string,
        profileImage: string | null = null,
        source: 'ROZETKA' | 'TELESMART'
    ) {
        this.title = title;
        this.subtitle = subtitle;
        this.description = description;
        this.price = price;
        this.specifications = specifications;
        this.type = type;
        this.profileImage = profileImage;
        this.source = source;
    }
}

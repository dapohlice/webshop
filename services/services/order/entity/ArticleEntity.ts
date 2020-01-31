import {Entity,PrimaryGeneratedColumn,Column,BaseEntity} from "typeorm";

/**
 * Artikeldatensatz
 */
@Entity("article")
export class ArticleEntity extends BaseEntity
{   
    @PrimaryGeneratedColumn()
    id: number;

    @Column("bigint")
    article_id: number;

    @Column("varchar")
    name: string;

    @Column("datetime")
    timestamp: Date;

    @Column("int")
    price: number;

}
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToOne,
    JoinColumn,
    ManyToOne
} from "typeorm";
import { OrderEntity } from "./OrderEntity"
import { ArticleEntity } from "./ArticleEntity";

/**
 * Artikel-Bestellung-Mappingtabelle
 */
@Entity("articleOrderMap")
export class ArticleOrderEntity extends BaseEntity
{   
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    amount: number;

    @Column("varchar")
    property: string;

    @ManyToOne(type => OrderEntity,order => order.logs)
    order: OrderEntity;

    @OneToOne(type => ArticleEntity)
    @JoinColumn()
    article: ArticleEntity;


}
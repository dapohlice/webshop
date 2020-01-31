import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToOne,
    JoinColumn,
    OneToMany
} from "typeorm";
import { AddressEntity } from "./AddressEntity"
import { StatusEntity } from "./StatusEntity";
import { OrderLogEntity } from "./OrderLogEntity";
import { ArticleOrderEntity } from "./ArticleOrderEntity";

/**
 * Bestellungsdatensatz
 */
@Entity("order")
export class OrderEntity extends BaseEntity
{   
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar",{length: 1000})
    mail: String;

    @Column("datetime")
    timestamp: Date;

    @OneToOne(type => AddressEntity)
    @JoinColumn()
    address: AddressEntity;

    @OneToOne(type => StatusEntity)
    @JoinColumn()
    status: StatusEntity;

    @OneToMany(type => OrderLogEntity, log =>log.order)
    logs: OrderLogEntity

    @OneToMany(type => ArticleOrderEntity, article =>article.order)
    articles: OrderLogEntity
}
import {
    Entity,
    PrimaryColumn,
    Column,
    BaseEntity,
    OneToOne,
    JoinColumn,
    ManyToOne
} from "typeorm";
import { OrderEntity } from "./OrderEntity"
import { StatusEntity } from "./StatusEntity";
/**
 * Bestelllogdatensatz
 */
@Entity("orderlog")
export class OrderLogEntity extends BaseEntity
{   
    @PrimaryColumn()
    id: number;

    @Column("datetime")
    timestamp: Date;

    @Column("varchar")
    user: string;

    @Column("text")
    info: string;

    @ManyToOne(type => OrderEntity,order => order.logs)
    order: OrderEntity;

    @OneToOne(type => StatusEntity)
    @JoinColumn()
    status: StatusEntity;
}
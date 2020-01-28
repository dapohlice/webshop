import {Entity,PrimaryColumn,Column,BaseEntity,OneToOne,JoinColumn} from "typeorm";
/**
 * Statusdatensatz
 */
@Entity("orderstatus")
export class StatusEntity extends BaseEntity
{   
    @PrimaryColumn()
    id: number;

    @Column("varchar",{length: 20})
    name: string;

    @Column("boolean")
    needsPermission: boolean;

    @OneToOne(type => StatusEntity)
    @JoinColumn()
    next: StatusEntity;
}
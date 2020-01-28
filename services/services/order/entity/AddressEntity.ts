import {Entity,PrimaryColumn,Column,BaseEntity} from "typeorm";
/**
 * Addressdatensatz
 */
@Entity("address")
export class AddressEntity extends BaseEntity
{   
    @PrimaryColumn()
    id: number;

    @Column("varchar")
    firstname: string;

    @Column("varchar")
    lastname: string;

    @Column("varchar")
    street: string;

    @Column("varchar",{length: 50})
    streetnumber: string;

    @Column("varchar",{length: 7})
    plz: string;

    @Column("varchar")
    town: string;

    @Column("varchar",{nullable: true})
    state: string;

    @Column("varchar")
    country: string;
}
import {Entity,PrimaryGeneratedColumn,Column,BaseEntity,ManyToMany} from "typeorm";
import {UserEntity} from "./UserEntity"
/**
 * Gruppendatensatz
 */
@Entity("group")
export class GroupEntity extends BaseEntity
{   
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    name: string;

    @Column("boolean")
    auth_user: boolean;

    @Column("boolean")
    auth_product: boolean;

    @Column("boolean")
    auth_group: boolean;

    @Column("boolean")
    auth_normalOrders: boolean;

    @Column("boolean")
    auth_allOrders: boolean;

    @ManyToMany(type => UserEntity, user => user.groups)
    users: UserEntity[];
}
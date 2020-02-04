import {Entity,PrimaryGeneratedColumn,Column,BaseEntity,ManyToMany,JoinTable} from "typeorm";
import {GroupEntity} from "./GroupEntity"
/**
 * Benutzerdatensatz
 */
@Entity("user")
export class UserEntity extends BaseEntity
{   
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    firstname: string;

    @Column("varchar")
    lastname: string;

    @Column("varchar",{length: 1000})
    mail: string;

    @Column("varchar",{length: 20})
    loginname: string;

    @Column("varchar",{select: false})
    pword: string;

    @Column("boolean")
    status: boolean;

    @ManyToMany(type => GroupEntity, group => group.users,{
            cascade: true
        })
    @JoinTable()
    groups: GroupEntity[];

}
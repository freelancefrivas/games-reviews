import {Entity, PrimaryKey, Property, BeforeCreate, Enum, OneToMany, Collection} from '@mikro-orm/core';
import bcrypt from 'bcrypt';

export enum RoleType {
    ADMIN = 'admin',
    WRITER = 'writer',
    EDITOR = 'editor',
    READER = 'reader',
}

@Entity({ tableName: 'user' })
export class User {
    @PrimaryKey({ type: 'text' })
    id!: string;

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();

  	@Property({ type: 'text' })
  	name!: string;

    @Property({  })
    email!: string;

    @Property({ })
    nickname!: string;
    
    @Property()
  	emailVerified!: boolean;

    @Property({ type: 'text', nullable: true })
    image?: string;

    @Enum(() => RoleType)
    role: RoleType = RoleType.WRITER;

    /*async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async verifyPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }*/

   /* toJSON() {
        const { password, ...user } = this;
        return user;
    }*/


}
import { Entity, PrimaryKey, Property, BeforeCreate } from '@mikro-orm/core';
import bcrypt from 'bcrypt';


@Entity({ tableName: 'users' })
export class User {
    @PrimaryKey({ type: 'number', autoincrement: true })
    id!: number;

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();

    @Property({ fieldName: 'first_name' })
    firstName!: string;

    @Property({ fieldName: 'last_name' })
    lastName!: string;

    @Property({  })
    email!: string;

    @Property({ })
    nickname!: string;

    @Property()
    password!: string;

    @Property()
    admin!: boolean;

    @Property()
    writer!: boolean;

    @BeforeCreate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async verifyPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    toJSON() {
        const { password, ...user } = this;
        return user;
    }


}
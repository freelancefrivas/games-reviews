import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';

@Entity({ tableName: 'tags' })
export class Tag {
    @PrimaryKey()
    id!: number;

    @Property({  })
    name!: string;

}
import { Entity, Column, BaseEntity, ObjectIdColumn } from "typeorm";

@Entity()
export class Shortlink extends BaseEntity {
  @ObjectIdColumn()
  _id!: Object;

  @Column()
  short_link!: string;

  @Column()
  full_link!: string;

  @Column({
    default: 0,
  })
  clicks!: number;
}

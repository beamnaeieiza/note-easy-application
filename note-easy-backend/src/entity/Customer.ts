import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Note } from "./Note";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  customer_id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Note, (note: Note) => note.customer, {
    onDelete: "CASCADE",
  })
  notes: Array<Note>;
}

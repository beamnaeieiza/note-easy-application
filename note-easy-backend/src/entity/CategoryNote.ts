import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Customer } from "./Customer";
import { Note } from "./Note";

@Entity()
export class CategoryNote {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ name: "note_id", nullable: false })
  note_id: number;

  @Column()
  category_name: string;

  @OneToOne(() => Note, (note) => note.category, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "note_id" })
  note: Note;
}

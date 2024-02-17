import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Customer } from "./Customer";
import { Note } from "./Note";

@Entity()
export class HistoryNote {
  @PrimaryGeneratedColumn()
  history_id: number;

  @Column({ name: "note_id", nullable: false })
  note_id: number;

  @Column()
  text: string;

  @Column()
  remindAt: Date;

  @Column()
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Note, (note) => note.histories, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "note_id" })
  note: Array<Note>;
}

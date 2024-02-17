import { type } from "os";
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
import { CategoryNote } from "./CategoryNote";
import { Customer } from "./Customer";
import { HistoryNote } from "./HistoryNote";

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  note_id: number;

  @Column({ name: "customer_id", nullable: false })
  customer_id: number;

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

  @ManyToOne(() => Customer, (customer) => customer.notes)
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @OneToMany(() => HistoryNote, (history: HistoryNote) => history.note, {
    onDelete: "CASCADE",
  })
  histories: Array<HistoryNote>;

  @OneToOne(() => CategoryNote, (category) => category.note)
  category: CategoryNote;
}

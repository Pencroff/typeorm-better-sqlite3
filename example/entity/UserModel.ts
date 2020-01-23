
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('User')
export class UserModel {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  name: string;

  @Column('numeric')
  age: number;
}

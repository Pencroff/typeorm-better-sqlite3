import { createConnection } from 'typeorm';
import { OrmService } from '@pencroff/typeorm-better-sqlite3'; // correct import
// import { OrmService } from '../src'; // local import
import { UserModel } from './entity/UserModel';

async function run() {
  const orm = new OrmService();
  const con = await createConnection();
  await orm.useConnection(con);
  const repo = orm.getRepo(UserModel);
  const user = repo.create({
    id: 'id-1',
    name: 'Wood',
    age: 10
  } as UserModel);
  await repo.save(user);
  const result: UserModel[] = await repo.find({
    where: {
      age: 10,
    },
  });
  console.log('result', result); // result [ UserModel { id: 'id-1', name: 'Wood', age: 10 } ]
  return true;
}

run();

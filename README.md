# typeorm-better-sqlite3

[Github](https://github.com/Pencroff/typeorm-better-sqlite3)

Performant [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3) driver for [Typeorm](https://typeorm.io/#/).

It's 10x or even 18x faster for some cases - [link](https://github.com/JoshuaWise/better-sqlite3#how-other-libraries-compare)

## Usage

```
import { Connection, createConnection } from 'typeorm';
import { OrmService } from '@pencroff/typeorm-better-sqlite3';

async function run() {
    const orm = new OrmService();
    const con = await createConnection();
    await orm.useConnection(con);
    const repo = orm.getRepo(SomeModel);
    const result: SomeModel[] = await repo.find({
      where: {
        fieldA: 'abd',
        fieldB: 123,
      },
    })
}

```

for more details please check **[example](https://github.com/Pencroff/typeorm-better-sqlite3/tree/master/example)** folder

## Instalation notes

It requires building tools and Python 2 (should be >=2.6.0 <3.0.0).

Python 2 can be used from folder "C:\Python27\python.exe"

Make sure - `sqlite3` package required for migrations

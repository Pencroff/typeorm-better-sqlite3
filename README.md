# [deprecated] typeorm-better-sqlite3

## The Typeorm has build in better-sqlite3 driver - [better-sqlite3 driver](https://typeorm.io/#/connection-options/better-sqlite3-connection-options)

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

Python 2 can be used from folder "C:\Python27\python.exe" (Not required to be in `PATH`)

Actually just run as Administrator (if you have any issue with compiling `better-sqlite3`):

```
npm install --global --production windows-build-tools
```

More details [here](https://github.com/nodejs/node-gyp#on-windows).

Make sure to have `sqlite3` package in your dev dependency. It requires for migrations.

## Known issues

* Import `createConnection` before `OrmService`. Like below:

```
import { createConnection } from 'typeorm';
import { OrmService } from '@pencroff/typeorm-better-sqlite3';
``` 

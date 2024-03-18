import express from 'express';
import { PrismaClient } from '@prisma/client';
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
// const prisma = new PrismaClient();


// async function main() {
//   const newUser = await prisma.user.create({
//     data: {
//       name: 'Alice',
//       email: 'alice@prisma.io',
//     },
//   })
//   console.log(newUser)
// }

// main()
//   .catch((e) => {
//     throw e
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
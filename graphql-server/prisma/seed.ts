// seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
console.log('prisma')
const usersData = [
  { name: 'John Doe', password: '1234', email: 'jane@example.com' },
  { name: 'Jane Doe', password: '56765', email: 'jane@example.com' },
  // Add more users as needed
];

const seed = async () => {
  for (const userData of usersData) {
    await prisma.user.create({
      data: userData,
    });
  }
};

// Call the seed function
seed()
  .catch((error) => {
    throw error;
  })
  .finally(async () => {
    // Close the Prisma client connection when done
    await prisma.$disconnect();
  });
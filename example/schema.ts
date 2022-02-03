import {Client} from '../src';
import {User} from './schemas';
import {ObjectId} from 'mongodb';

/**
 * Creates User repository.
 */
async function createRepository() {
  // Create MongoDB client.
  const client = new Client({host: '127.0.0.1', port: 27017});

  // Connect client to database server.
  await client.connect();

  // Create Db instance with passed name.
  const db = client.db('mongo-orm');

  // Create Repository instance with passed user schema.
  return db.repository(User);
  // Or we could use db.repository(User, 'other-source') to override default
  // User schema source. TypeScript and JavaScript errors will be thrown,
  // in case source is not defined while creating schema nor in repository().
}

/**
 * Returns all documents in "users" collection.
 */
async function findAllUsers() {
  // Create users repository.
  const repository = await createRepository();

  // Find all users.
  const users = await repository.find();

  console.log('All users:', users);
}

type Schema = typeof User['schema'];

/**
 * Creates test user.
 */
async function createTestUser() {
  // Create users repository.
  const repository = await createRepository();

  // Create new user.
  const user = await repository.save({
    createdAt: new Date,
    firstName: 'Wolfram',
    lastName: 'Deus',
    bankCard: {
      name: 'Wolfram Deus',
      expDate: {
        year: 2025,
        month: 5,
      },
    },
  });

  console.log('Created user:', user);
}

(async () => {
  await findAllUsers();
  // await createTestUser();
})();
import {createSchema} from '../../src';
import {ObjectId} from 'mongodb';
import {UserBankCard} from './UserBankCard';

/**
 * Users collection document schema.
 */
export const User = createSchema({
  // Document ID field.
  id: {
    // Mark this field as primary. So, ORM will know that this field is
    // document's _id field. Additionally, ORM will override passed here "name"
    // property as long as MongoDB's document primary fields always has "_id"
    // name.
    primary: true,
    // Say ORM that this field is ObjectId.
    type: ObjectId,
    name: '_id' as const,
  },
  // User first name.
  firstName: String,
  // User last name.
  lastName: String,
  // User middle name. Not all people has middle name, but we want it to
  // always be string.
  middleName: {
    type: String,
    defaultValue: '',
  },
  // User bank card. It is objects, so we defined its schema previously.
  bankCard: UserBankCard,
  // Date, when user was created.
  createdAt: Date,
  // Date, when user was deleted.
  deletedAt: {
    type: Date,
    // Document is not always deleted, so it can be optional.
    optional: true,
  },
  // Is user administrator of project.
  admin: {
    type: Boolean,
    defaultValue: false,
    // Locally, we want to use name "admin". This field refers to document's
    // "isAdmin" field.
    name: 'isAdmin' as const,
  },
}, {name: 'User', source: 'users'});
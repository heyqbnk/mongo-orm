import {Client, Field, Model} from './src';
import {ObjectId} from 'bson';

@Model('users')
class User {
  @Field({id: true})
  id: ObjectId;
}

(async () => {
  const client = await Client.init({
    connection: {
      uri: 'mongodb://localhost:27017',
      db: 'nutritionLite'
    },
    models: [User],
  });
})();
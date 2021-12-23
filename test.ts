import {Client, Field, Model} from './src';
import {ObjectId} from 'bson';

@Model({collection: 'nutritionLite'})
class User {
  @Field({})
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
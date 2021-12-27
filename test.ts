import {Client, Field, Model} from './src';

@Model('users')
class User {
  @Field({id: true, name: '_id'})
  id: number;
}

(async () => {
  const client = await Client.init({
    connection: {
      uri: 'mongodb://127.0.0.1:27017',
      db: 'nutritionLite'
    },
  });
  const userRepository = client.getRepository(User);
  const user = await userRepository.findOne({id: 68728796});

  console.log(user)
})();
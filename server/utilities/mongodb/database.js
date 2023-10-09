import { MongoClient, ServerApiVersion } from 'mongodb';

export async function connectToMongoDb() {
  const uri = "mongodb+srv://doc-shufelt:Vitalogy!1994@cluster0.zw47mqi.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  await client.connect()
  
  return client
}

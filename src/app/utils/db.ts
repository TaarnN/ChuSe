import { Document, MongoClient, OptionalId, ServerApiVersion } from "mongodb";

const password = "uBmUsqsbmmLdj0XT";

const uri = `mongodb+srv://taarnng:${password}@cluster0.bipbk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export default async function run(inserts: OptionalId<Document>[] = []) {
  if (!(inserts.length < 1)) {
    try {
      await client.connect();
      const db = client.db("ChurairatSEDB");
      const collection = db.collection("searchs");

      await collection.insertMany(inserts);
    } finally {
      await client.close();
    }
  }
}
run().catch(console.dir);

export { run, client, uri, password };

import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const dbUri =  process.env.MONGO_URI;

export default async function dbConnect() {
    try {
        const client = new MongoClient(dbUri);
        await client.connect();
        return client
    } catch (error) {
        console.log(error);
        throw error;
    }
}
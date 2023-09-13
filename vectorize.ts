import { SimpleDirectoryReader, VectorStoreIndex, storageContextFromDefaults } from "llamaindex";
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log("Loading documents from directory...");
  const documents = await new SimpleDirectoryReader().loadData({directoryPath: "pdfs"});
  console.log("Documents loaded successfully.");

  console.log("Creating a StorageContext...");
  const storageContext = await storageContextFromDefaults({ persistDir: "./storage" });
  console.log("StorageContext created successfully.");

  console.log("Splitting text and creating embeddings...");
  const index = await VectorStoreIndex.fromDocuments(documents, { storageContext });
  console.log("Embeddings created and stored successfully.");
}

main();
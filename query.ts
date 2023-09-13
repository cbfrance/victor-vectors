import { SimpleDirectoryReader, VectorStoreIndex, storageContextFromDefaults } from "llamaindex";
import dotenv from 'dotenv';

dotenv.config();


async function main() {
  // Load all documents from test/sample_pdfs directory
  const documents = await new SimpleDirectoryReader().loadData({directoryPath: "test/sample_pdfs"});

  // Create a StorageContext
  const storageContext = await storageContextFromDefaults({ persistDir: "./storage" });

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments(documents, { storageContext });

  // Query the index
  const queryEngine = index.asQueryEngine();
  const response = await queryEngine.query(
    "Theorize about the role of distributed congition in the arts, think step by step",
  );

  // Output response
  console.log(response.toString());
}

main();
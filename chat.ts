import { SimpleDirectoryReader, VectorStoreIndex, storageContextFromDefaults, ContextChatEngine, CallbackManager } from "llamaindex";
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

async function main() {
  // Load all documents from test/sample_pdfs directory
  const documents = await new SimpleDirectoryReader().loadData({directoryPath: "test/sample_pdfs"});

  // Create a StorageContext
  const storageContext = await storageContextFromDefaults({ persistDir: "./storage" });

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments(documents, { storageContext });

  // Create a chat engine
  const retriever = index.asRetriever();
  const chatEngine = new ContextChatEngine({ retriever });

  // Create a callback manager for streaming responses
  const callbackManager = new CallbackManager({
    onLLMStream: (params) => {
      console.log(`Streaming response: ${params}`);
    },
  });

  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Function to handle user input
  const chat = async () => {
    rl.question('You: ', async (input) => {
      const response = await chatEngine.chat(input, callbackManager);
      console.log(`Bot: ${response.toString()}`);
      chat(); // Call chat again to keep the chat session going
    });
  }

  // Start chatting
  chat();
}

main();
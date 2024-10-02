import assert from "node:assert";
import { generate } from "csv-generate";
import { parse } from "csv-parse";
import { createReadStream } from "node:fs";
import axios from "axios";

const filePath = "../tasks.csv";
const postURL = "http://localhost:3333/tasks";
(async () => {
  // Initialise the parser by generating random records

  const fileStream = createReadStream(filePath);

  const parser = fileStream.pipe(
    parse({ columns: true, skip_empty_lines: true })
  );

  // Intialise count
  let count = 0;
  // Report start
  process.stdout.write("start\n");
  // Iterate through each records
  for await (const record of parser) {
    // Report current line
    process.stdout.write(`${count++} ${JSON.stringify(record)}\n`);

    try {
      const response = await axios.post(postURL, JSON.stringify(record));
      console.log("Resposta da requisicao: ", response);
    } catch (error) {
      console.error("Erro ao enviar requisicao.");
    }

    // Fake asynchronous operation
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  // Report end
  process.stdout.write("...done\n");
  // Validation
  assert.strictEqual(count, 100);
})();

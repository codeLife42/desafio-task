import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table) {
    const data = this.#database[table] ?? [];

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  delete(table, indexToDelete) {
    const index = this.#database[table]?.findIndex(
      (task) => task.id === indexToDelete
    );

    if (index !== -1) {
      this.#database[table].splice(index, 1);
      this.#persist();
      return true;
    }

    return false;
  }

  update(table, idToUpdate, typeOfContent, content) {
    const index = this.#database[table]?.findIndex(
      (task) => task.id === idToUpdate
    );

    if (index !== -1 && typeOfContent === "title") {
      this.#database[table][index].title = content;
      this.#database[table][index].updated_at = Date();
      this.#persist();
      return true;
    }

    if (index !== -1 && typeOfContent === "description") {
      this.#database[table][index].description = content;
      this.#database[table][index].updated_at = Date();
      this.#persist();
      return true;
    }

    return false;
  }

  patch(table, idToUpdate) {
    const index = this.#database[table]?.findIndex(
      (task) => task.id === idToUpdate
    );

    if (index !== -1) {
      this.#database[table][index].completed_at = Date();
      this.#database[table][index].updated_at = Date();
      this.#persist();
      return true;
    }

    return false;
  }
}

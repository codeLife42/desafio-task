import { randomUUID } from "node:crypto";
import { Database } from "./Database.js";
import { buildRoutePath } from "../utils/build-route-path.js";

const dataBase = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const tasks = dataBase.select("tasks");

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description, completed_at, created_at, updated_at } =
        req.body;

      const date_time = Date();

      const tasks = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: date_time,
        updated_at: date_time,
      };

      dataBase.insert("tasks", tasks);

      return res.end("Criacao de tarefa");
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const id = req.params.id;

      if (dataBase.delete("tasks", id)) {
        return res.end("Tarefa excluida");
      } else {
        return res.end("Tarefa nao encontrada");
      }
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const id = req.params.id;

      const content = req.body;

      if (content.title !== undefined) {
        dataBase.update("tasks", id, "title", content.title);
        return res.end("Tarefa atualizada");
      } else if (content.description !== undefined) {
        dataBase.update("tasks", id, "description", content.description);
        return res.end("Tarefa atualizada");
      }

      return res.end("Tarefa nao atualizada, erro ao buscar dados");
    },
  },
];

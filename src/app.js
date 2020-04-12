const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function findIndex(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repositório não encontrado!" });
  }

  request.index = repositoryIndex;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", findIndex, (request, response) => {
  const { id } = request.params;
  const index = request.index;
  const { url, title, techs } = request.body;

  const repositoryUptaded = {
    id,
    url,
    title,
    techs,
    likes: repositories[index].likes,
  };

  repositories[index] = repositoryUptaded;

  return response.json(repositoryUptaded);
});

app.delete("/repositories/:id", findIndex, (request, response) => {
  const index = request.index;

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", findIndex, (request, response) => {
  const index = request.index;

  const likedRepository = repositories[index];

  likedRepository.likes += 1;

  return response.json(likedRepository);
});

module.exports = app;

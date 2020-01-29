const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

server.use((req, res, next) => {
  console.time('Request');
  console.count('Chamadas');
  next();
  console.timeEnd('Request');
});

function returnIndex(id) {
  return projects.findIndex(p => p.id === parseInt(id));
}

function checkBodyisOK(req, res, next) {
  if (!req.body.id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  if (!req.body.title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  return next();
}

function checkIfProjectExists(req, res, next) {
  const project = projects[returnIndex(req.params.id)];

  if (!project) {
    return res.status(400).json({ error: 'Project does not exists' });
  }

  return next();
}

server.post('/projects', checkBodyisOK, (req, res) => {
  const { id, title } = req.body;
  let project = { id: id, title: title, tasks: [] };
  projects.push(project);

  return res.json(projects);
});

server.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[returnIndex(id)].tasks.push(title);

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[returnIndex(id)].title = title;

  return res.json(projects);
});

server.delete('/projects/:id', checkIfProjectExists, (req, res) => {
  const { id } = req.params;

  projects.splice(returnIndex(id), 1);

  return res.json(projects);
});

server.listen(3000);

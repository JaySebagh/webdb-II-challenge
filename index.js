const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3',
  },
  useNullAsDefault: true, // needed for sqlite
}
const db = knex(knexConfig);

// R in CRUD
// get
server.get('/api/zoos', async (req, res) => {
  try {
    const zoos = await db('zoos');
    res.status(200).json(zoos);
  } catch (error) {
    res.status(500).json({ message: 'Cannot get Zoos' });
  }
});

// get by ID
server.get('/api/zoos/:id', async (req, res) => {
  try {
    const zoos = await db('zoos')
      .where({ id: req.params.id })
      .first();
    res.status(200).json(zoos);
  } catch (error) {
    res.status(500).json({ message: 'Cannot find ID' });
  }
});

// C in CRUD
// add
server.post('/api/zoos', async (req, res) => {
  try {
    const [id] = await db('zoos')
      .insert(req.body);
    const zoos = await db('zoos')
      .where({ id })
      .first()
    res.status(201).json(zoos);
  } catch(error) {
    res.status(500).json({ message: "Cannot Add" });
  }
});

// U in CRUD
// update
server.put('api/zoos/:id', async (req, res) => {
  try {
    const count = await db('zoos')
      .where({ id: req.params.id })
      .update(req.body);

    if(count > 0) {
      const zoos = await db('zoos')
        .where({ id: req.params.id })
        .first();

        res.status(200).json(zoos);
    } else {
      res.status(404).json({ message: "Records not found" });
    } 
  } catch (error) {}
});

// D in CRUD
// delete
server.delete('/api/zoos/:id', async (req, res) => {
  try {
    const count = await db('zoos')
    .where({ id: req.params.id })
    .del();

  if(count > 0) {
    res.status(204).end();
  } else {
    res.status(404).json({ message: "Records not found"});
  }
  } catch (error) {}
})

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here



const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

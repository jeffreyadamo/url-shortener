const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const yup = require('yup');
const nanoid = require('nanoid');

const { MongoClient } = require('mongodb');


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

const schema = yup.object().shape({
  slug: yup.string().trim().matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
})

app.get('/', (req, res) => {
  res.json({
    message: 'url shortener'
  });
});

// app.get('/:id', (req, res) => {
//   // TODO: redirect to url 
// });
app.post('/url', async (req, res, next) => {
  const { slug, url } = req.body;
  
  try {
    await schema.validate({
      slug,
      validate
    });
    if(!slug) {
      slug = nanoid();
    }
    slug = slug.toLowerCase();
    res.json({
      slug,
      url,
    })
  } catch (error) {
    next(error)
  }
});
// app.get('/url/:id', (req, res) => {
//   // TODO: get a short url by id 
// });

// BEGIN MONGODB test example
// async function run() {
//   try {
//     await client.connect();
//     const database = client.db('sample_mflix');
//     const movies = database.collection('movies');
//     // Query for a movie that has the title 'Back to the Future'
//     const query = { title: 'Back to the Future' };
//     const movie = await movies.findOne(query);
//     console.log(movie);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
// END MONGODB test example

const port = process.env.PORT || 1337;
app.listen(port, () => {  
  console.log(`Listening a http://localhost:${port}`);
});
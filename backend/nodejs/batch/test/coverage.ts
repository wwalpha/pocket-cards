import express from 'express';

const app = express();

app.use(express.static('./coverage/lcov-report'));

app.listen(8080, () => console.log('App listening on port 8080!'));

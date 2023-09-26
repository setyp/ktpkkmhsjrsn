const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Impor router
const kkRouter = require('./routes/kkRouter');
const ktpRouter = require('./routes/ktpRouter');
const detailRouter = require('./routes/detailRouter');

// Gunakan router sesuai dengan path yang diinginkan
app.use('/kk', kkRouter);
app.use('/ktp', ktpRouter);
app.use('/detail', detailRouter);

const mhsRouter = require('./routes/mahasiswa');
app.use('/api/mhs', mhsRouter);

const jurusanRouter = require('./routes/jurusan');
app.use('/api/jurusan', jurusanRouter);

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});

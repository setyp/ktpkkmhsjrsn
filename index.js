const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors())

const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public/images')))

const bodyPs = require('body-parser'); 
app.use(bodyPs.urlencoded({ extended: false}));
app.use(bodyPs.json());

// Impor router
const kkRouter = require('./routes/kkRouter');
const ktpRouter = require('./routes/ktpRouter');
const detailRouter = require('./routes/detailRouter');
const dtransportrouter = require('./routes/transport');
// Gunakan router sesuai dengan path yang diinginkan
app.use('/kk', kkRouter);
app.use('/ktp', ktpRouter);
app.use('/detail', detailRouter);
app.use('/transport', dtransportrouter);

const mhsRouter = require('./routes/mahasiswa');
app.use(mhsRouter);

const jurusanRouter = require('./routes/jurusan');
app.use( jurusanRouter);

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});

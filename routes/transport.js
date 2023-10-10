const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connection = require('../config/db');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Middleware untuk mengelola file upload
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new Error('Jenis file tidak diizinkan'), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Endpoint untuk mendapatkan semua data transmisi
router.get('/transmisi', (req, res) => {
  connection.query('SELECT * FROM transmisi', (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Server Error',
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'Data Transmisi',
        data: rows,
      });
    }
  });
});

// Endpoint untuk mengupdate data transmisi berdasarkan id_transmisi
router.put('/transmisi/:id', (req, res) => {
    const id_transmisi = req.params.id;
    const { nama_transmisi } = req.body;
    const data = { nama_transmisi };
  
    connection.query('UPDATE transmisi SET ? WHERE id_transmisi = ?', [data, id_transmisi], (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Server Error',
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'Data Transmisi telah diupdate',
        });
      }
    });
  });
  
  // Endpoint untuk menghapus data transmisi berdasarkan id_transmisi
router.delete('/transmisi/:id', (req, res) => {
    const id_transmisi = req.params.id;
  
    connection.query('DELETE FROM transmisi WHERE id_transmisi = ?', [id_transmisi], (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Server Error',
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'Data Transmisi telah dihapus',
        });
      }
    });
  });
  
  // Endpoint untuk mengupdate data kendaraan berdasarkan id_m (ID kendaraan)
// Endpoint untuk mengupdate data kendaraan berdasarkan no_pol
router.patch('/kendaraan/update/:no_pol', upload.single("gambar"), [
    body('nama').notEmpty(),
    body('nrp').notEmpty(),
    body('id_jurusan').notEmpty()
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    
    const no_pol = req.params.no_pol; // Gunakan nomor polisi sebagai pengidentifikasi unik
    const gambar = req.file ? req.file.filename : null;

    connection.query(`SELECT * FROM kendaraan WHERE no_pol = ?`, [no_pol], function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        }
        if(rows.length ===0){
            return res.status(404).json({
                status: false,
                message: 'Not Found',
            })
        }
        const namaFileLama = rows[0].gambar;

        if (namaFileLama && gambar) {
            const pathFileLama = path.join(__dirname, '../public/images', namaFileLama);
            fs.unlinkSync(pathFileLama);
        }

        let Data = {
            no_pol: req.body.nama,
            nama_kendaraan: req.body.nrp,
            id_transmisi: req.body.id_jurusan,
            gambar_kendaraan: gambar
        }
        connection.query(`UPDATE kendaraan SET ? WHERE no_pol = ?`, [Data, no_pol], function (err, rows) {
            if(err){
                return res.status(500).json({
                    status: false,
                    message: 'Server Error',
                })
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'Update Success..!'
                })
            }
        })
    })    
});
// Endpoint untuk menambahkan data transmisi baru
router.post('/transmisi', (req, res) => {
  const { nama_transmisi } = req.body;
  const data = { nama_transmisi };

  connection.query('INSERT INTO transmisi SET ?', data, (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Server Error',
      });
    } else {
      return res.status(201).json({
        status: true,
        message: 'Data Transmisi telah ditambahkan',
        data: rows.insertId,
      });
    }
  });
});

// Endpoint untuk mendapatkan semua data kendaraan
router.get('/kendaraan', (req, res) => {
  connection.query('SELECT * FROM kendaraan', (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Server Error',
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'Data Kendaraan',
        data: rows,
      });
    }
  });
});

// Endpoint untuk menambahkan data kendaraan baru
router.post('/kendaraan', upload.single('gambar'), (req, res) => {
  const { no_pol, nama_kendaraan, id_transmisi } = req.body;
  const gambar_kendaraan = req.file ? req.file.filename : null;
  const data = { no_pol, nama_kendaraan, id_transmisi, gambar_kendaraan };

  connection.query('INSERT INTO kendaraan SET ?', data, (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Server Error',
      });
    } else {
      return res.status(201).json({
        status: true,
        message: 'Data Kendaraan telah ditambahkan',
        data: rows.insertId,
      });
    }
  });
});

// Endpoint untuk menghapus data kendaraan berdasarkan no_pol
router.delete('/kendaraan/:no_pol', (req, res) => {
  const no_pol = req.params.no_pol;

  connection.query('DELETE FROM kendaraan WHERE no_pol = ?', [no_pol], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Server Error',
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'Data Kendaraan telah dihapus',
      });
    }
  });
});

module.exports = router;

// routes/kkRouter.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { body, validationResult } = require('express-validator');
// CRUD untuk tabel Kartu Keluarga

// Mendapatkan semua data dari tabel Kartu Keluarga
router.get('/kartu_keluarga', (req, res) => {
    db.query('SELECT * FROM kartu_keluarga', (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Gagal',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Kartu Keluarga',
                data: rows,
            });
        }
    });
});

// Menambahkan data baru ke tabel Kartu Keluarga
router.post('/kartu_keluarga', [
    // Validasi untuk input data
    body('no_kk').notEmpty().withMessage('No. KK harus diisi'),
    body('alamat').notEmpty().withMessage('Alamat harus diisi'),
    // Tambahkan validasi lain sesuai dengan skema Kartu Keluarga
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }

    const data = {
        no_kk: req.body.no_kk,
        alamat: req.body.alamat,
        rt: req.body.rt,
        rw: req.body.rw,
        kode_pos: req.body.kode_pos,
        desa_kelurahan: req.body.desa_kelurahan,
        kecamatan: req.body.kecamatan,
        kabupaten_kota: req.body.kabupaten_kota,
        provinsi: req.body.provinsi,
    };

    db.query('INSERT INTO kartu_keluarga SET ?', data, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            data.no_kk = result.insertId;
            return res.status(201).json({
                status: true,
                message: 'Data Kartu Keluarga berhasil ditambahkan',
                data: data,
            });
        }
    });
});

// Memperbarui data di tabel Kartu Keluarga
router.patch('/kartu_keluarga/:no_kk', [
    // Validasi untuk input data yang akan diperbarui
    body('alamat').notEmpty().withMessage('Alamat harus diisi'),
    // Tambahkan validasi lain sesuai dengan skema Kartu Keluarga
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }

    const no_kk = req.params.no_kk;
    const data = {
        alamat: req.body.alamat,
        rt: req.body.rt,
        rw: req.body.rw,
        kode_pos: req.body.kode_pos,
        desa_kelurahan: req.body.desa_kelurahan,
        kecamatan: req.body.kecamatan,
        kabupaten_kota: req.body.kabupaten_kota,
        provinsi: req.body.provinsi,
    };

    db.query('UPDATE kartu_keluarga SET ? WHERE no_kk = ?', [data, no_kk], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Kartu Keluarga berhasil diperbarui',
            });
        }
    });
});
// GET data Kartu Keluarga by No. KK
router.get('/kartu_keluarga/:no_kk', (req, res) => {
    const no_kk = req.params.no_kk;
    
    db.query('SELECT * FROM kartu_keluarga WHERE no_kk = ?', no_kk, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Kartu Keluarga tidak ditemukan',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Kartu Keluarga',
                data: rows[0],
            });
        }
    });
});

// Menghapus data dari tabel Kartu Keluarga
router.delete('/kartu_keluarga/:no_kk', (req, res) => {
    const no_kk = req.params.no_kk;
    db.query('DELETE FROM kartu_keluarga WHERE no_kk = ?', no_kk, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Kartu Keluarga berhasil dihapus',
            });
        }
    });
});


module.exports = router;

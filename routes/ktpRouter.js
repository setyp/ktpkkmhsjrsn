// routes/ktpRouter.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { body, validationResult } = require('express-validator');

// CRUD untuk tabel KTP

// Mendapatkan semua data dari tabel KTP
router.get('/ktp', (req, res) => {
    db.query('SELECT * FROM ktp', (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Gagal',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data KTP',
                data: rows,
            });
        }
    });
});

// Menambahkan data baru ke tabel KTP
router.post('/ktp/add', [
    // Validasi untuk input data
    body('nik').notEmpty().withMessage('NIK harus diisi'),
    body('nama_lengkap').notEmpty().withMessage('Nama lengkap harus diisi'),
    // Tambahkan validasi lain sesuai dengan skema KTP
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }

    const data = {
        nik: req.body.nik,
        nama_lengkap: req.body.nama_lengkap,
        jenis_kelamin: req.body.jenis_kelamin,
        tempat_lahir: req.body.tempat_lahir,
        tanggal_lahir: req.body.tanggal_lahir,
        agama: req.body.agama,
        pendidikan: req.body.pendidikan,
        golongan_darah: req.body.golongan_darah,
        kewarganegaraan: req.body.kewarganegaraan,
    };

    db.query('INSERT INTO ktp SET ?', data, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            data.nik = result.insertId;
            return res.status(201).json({
                status: true,
                message: 'Data KTP berhasil ditambahkan',
                data: data,
            });
        }
    });
});

// Mendapatkan data KTP berdasarkan NIK
router.get('/ktp/:nik', (req, res) => {
    const nik = req.params.nik;
    db.query('SELECT * FROM ktp WHERE nik = ?', nik, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Gagal',
            });
        } else if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data KTP tidak ditemukan',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data KTP',
                data: rows[0], // Mengambil data pertama karena NIK harus unik
            });
        }
    });
});

// Memperbarui data di tabel KTP
router.patch('/ktp/:nik', [
    // Validasi untuk input data yang akan diperbarui
    body('nama_lengkap').notEmpty().withMessage('Nama lengkap harus diisi'),
    // Tambahkan validasi lain sesuai dengan skema KTP
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }

    const nik = req.params.nik;
    const data = {
        nama_lengkap: req.body.nama_lengkap,
        jenis_kelamin: req.body.jenis_kelamin,
        tempat_lahir: req.body.tempat_lahir,
        tanggal_lahir: req.body.tanggal_lahir,
        agama: req.body.agama,
        jenis_pekerjaan: req.body.jenis_pekerjaan,
        golongan_darah: req.body.golongan_darah,
        kewarganegaraan: req.body.kewarganegaraan,
    };

    db.query('UPDATE ktp SET ? WHERE nik = ?', [data, nik], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data KTP berhasil diperbarui',
            });
        }
    });
});

// Menghapus data dari tabel KTP
router.delete('/ktp/:nik', (req, res) => {
    const nik = req.params.nik;
    db.query('DELETE FROM ktp WHERE nik = ?', nik, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data KTP berhasil dihapus',
            });
        }
    });
});

module.exports = router;

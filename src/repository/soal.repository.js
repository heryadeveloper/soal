const db = require('../db/models');
const {Op} = require('sequelize');

async function insertIntoSoal(kdSoal, nomorSoal, kdMapel, kelas, txSoal, jenis_soal, available_on){
    try {
        const soalinput = await db.soal.create({
            kode_soal: kdSoal,
            nomor_soal: nomorSoal,
            kode_mapel: kdMapel,
            kelas,
            text_soal: txSoal,
            jenis_soal,
            created_date: new Date,
            available_on: available_on
        });
        return soalinput.get({ plain: true });
    } catch (error) {
        console.error('Error when inserting data soal');
        throw error;
    }
}

async function insertIntoPilihan(kdSoal, nomorSoal, pilihan, idx_pilihan, kelas, pilihan_benar, skor) {
    try {
        await db.pilihan.create({
            kd_soal: kdSoal,
            nomor_soal: nomorSoal,
            pilihan,
            created_date: new Date,
            idx_pilihan,
            kelas,
            pilihan_benar,
            skor
        });
    } catch (error) {
        console.error('Error when inserting data ');
        throw error;
    }
}

async function insertIntoJawaban(kdSoal, nomorSoal, jawaban, jenis_soal, kelas, skor) {
    try {
        await db.pilihan.create({
            kd_soal: kdSoal,
            nomor_soal: nomorSoal,
            jenis_soal,
            jawaban,
            created_date: new Date,
            kelas,
            skor
        });
    } catch (error) {
        console.error('Error when inserting data ');
        throw error;
    }
}

async function getSoal(kode_soal, kelas){
    try {
        const soal = await db.soal.findAll({
            where:{
                kode_soal,
                kelas,
            },
            raw: true,
        });
        return soal;
    } catch (error) {
        console.error('Error when get soal', error);
        throw error;
    }
}

async function getSoalEssay(kode_soal,nomor_soal, kelas, jenis_soal){
    try {
        const soalEssay = await db.soal.findAll({
            where:{
                kode_soal,
                nomor_soal,
                kelas,
                jenis_soal,
            },
            raw: true,
        });
        return soalEssay;
    } catch (error) {
        console.error('Error when get soal', error);
        throw error;
    }
}

async function getPilgan(kode_soal,nomor_soal, kelas){
    try {
        const pilgan = await db.pilihan_ganda.findAll({
            where:{
                kode_soal,
                nomor_soal,
                kelas,
            },
            order:[['idx_pilihan','ASC']],
            raw: true,
        });
        return pilgan;
    } catch (error) {
        console.error('Error when get pilgan', error);
        throw error;
    }
}

async function getEssay(kode_soal, kelas){
    try {
        const pilgan = await db.essay.findAll({
            where:{
                kode_soal,
                kelas,
            },
            order:[['nomor_soal','ASC']],
            raw: true,
        });
        return pilgan;
    } catch (error) {
        console.error('Error when get pilgan', error);
        throw error;
    }
}

async function insertIntoPilihanBulk(jawabanPilihanGanda){
    try {
        await db.pilihan_ganda.bulkCreate(jawabanPilihanGanda);
    } catch (error) {
        console.error('Error when inserting data', error);
        throw error;
    }
}

async function insertJawabanSiswaBulk(jawabanSiswa){
    try {
        await db.data_jawaban_siswa.bulkCreate(jawabanSiswa);
    } catch (error) {
        console.error('Error when inserting data', error);
        throw error;
    }
}

async function getAvailableTest(kelas) {
    try{
        const status = 0;
        const availableSoal = await db.soal.findAll({
            where: {
                [Op.and]: [
                    { kelas },
                    { available_on: { [Op.lte]: new Date() } },
                    { status }
                ]
            },
            raw: true,
        })
        if (availableSoal.length > 0) {
            // Return availableSoal if data exists
            return availableSoal;
        } else {
            // Return a specific message if no data is found
            return [];
        }
    }catch(error){
        console.error('Error when get available test');
        throw error;
    }
}

async function updateStatusSoal(kode_mapel, kode_soal, kelas){
    try {
        await db.soal.update(
            { status: 1 }, // Set status to 1
            {
                where: {
                    kode_soal: kode_soal,
                    kode_mapel: kode_mapel,
                    kelas: kelas
                }
            }
        );
    } catch (error) {
        console.error('Error when update status soal');
        throw new error.message;
    }
}

module.exports = {
    insertIntoSoal,
    insertIntoPilihan,
    insertIntoJawaban,
    getSoal,
    getSoalEssay,
    getPilgan,
    getEssay,
    insertIntoPilihanBulk,
    insertJawabanSiswaBulk,
    getAvailableTest,
    updateStatusSoal
}
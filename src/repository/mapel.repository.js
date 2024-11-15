const { date } = require('@hapi/joi');
const db = require('../db/models');
const { QueryTypes } = require('sequelize');

async function insertDataMapel(idmapel, nama_mapel, kelas, guru_pengampu, kode_guru){
    try {
        await db.mapel.create({
            idmapel,
            nama_mapel,
            kelas,
            created_date: new Date,
            guru_pengampu,
            kode_guru
        });
    } catch (error) {
        console.error('Error when inserting data mapel');
        throw error;
    }
}

async function getDataMapel(){
    try {
        const responseData = await db.mapel.findAll({
            raw:true,
        });
        return responseData;
    } catch (error) {
        console.error('Error when get data mapel');
        throw error;
    }
}

async function getDataMapelForOne(idmapel){
    try {
        const responseData = await db.mapel.findOne({
            where: {
                idmapel
            },
            raw: true
        })
        return responseData;
    } catch (error) {
        console.error('Error get one mapel');
        throw error;
    }
}

async function getMapelForGuru(kode_guru){
    try {
        const responseData = await db.mapel.findAll({
            where :{
                kode_guru
            },
            raw: true
        })
        return responseData;
    } catch (error) {
        console.error('Error get mapel');
        throw error;
    }
}

async function getMapelAssignForClass(kd_mapel, kelas) {
    try {
        const responseData = await db.assign_soal.findOne({
            where : {
                kd_mapel,
                kelas
            },
            raw: true
        });
        return responseData;
    } catch (error) {
        console.error('Error get data assign');
        throw error;
    }
}

async function insertAssignSoal(kd_mapel, kelas, status_available) {
    try {
        await db.assign_soal.create({
            kd_mapel,
            kelas,
            status_available,
            created_date: new Date()
        })
    } catch (error) {
        console.error('Error insert assign soal');
        throw error;
    }
}

async function insertAssignSoalBulk(assignSoalBulk) {
    try {
        await db.assign_soal.bulkCreate(assignSoalBulk);
    } catch (error) {
        console.error('Error when inserting data bulk : ', error);
        throw error;
    }
}

async function getDataInduk(rombel_saat_ini, tahun_ajaran){
    try {
        const result = await db.sequelize.query(`
            select a.nisn from data_induk a
            where a.rombel_saat_ini = :rombel_saat_ini
            and a.tahun_ajaran = :tahun_ajaran`,
        {
            replacements: {
                rombel_saat_ini: rombel_saat_ini,
                tahun_ajaran: tahun_ajaran
            },
            type: QueryTypes.SELECT
        });
        return result;
    } catch (error) {
        console.error('error get data induk : ', getDataInduk);
        throw error;
    }
}
module.exports = {
    insertDataMapel,
    getDataMapel,
    getDataMapelForOne,
    getMapelForGuru,
    getMapelAssignForClass,
    insertAssignSoal,
    insertAssignSoalBulk,
    getDataInduk
}
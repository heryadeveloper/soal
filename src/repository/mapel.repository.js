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

async function getMapelForGuru(kode_guru, kelas){
    try {
        const result =`
            select distinct m.nama_mapel, m.idmapel , m.guru_pengampu , m.kelas   
            from mapel m 
            where m.kode_guru = :kode_guru
            and m.kelas = :kelas`;
        const responseData = await db.sequelize.query(result, {
            replacements: {kode_guru, kelas},
            type: db.Sequelize.QueryTypes.SELECT,
        });
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

async function insertMapelBulkKelas(dataInsertBulkKelasMapel) {
    try {
        await db.mapel.bulkCreate(dataInsertBulkKelasMapel);
    } catch (error) {
        console.error('Error when inserting data', error);
        throw error;
    }
}

async function deleteMapel(nama_mapel, kelas, guru_pengampu){
    try {
        const resultData = await db.sequelize.query(
            `delete from mapel where nama_mapel= :nama_mapel and kelas= :kelas and guru_pengampu= :guru_pengampu`,
            {
                replacements: {
                    nama_mapel: nama_mapel,
                    kelas: kelas,
                    guru_pengampu: guru_pengampu
                },
                type: QueryTypes.DELETE
            }
        );

        return{
            resultData
        };
    } catch (error) {
        console.error('Error delete mapel');
        throw error;
    }
}

async function getMapelForGuruUseKodeGuru(kode_guru){
    try {
        const result =`
            select distinct m.nama_mapel, m.idmapel , m.guru_pengampu
            from mapel m 
            where m.kode_guru = :kode_guru`;
        const responseData = await db.sequelize.query(result, {
            replacements: {kode_guru},
            type: db.Sequelize.QueryTypes.SELECT,
        });
        return responseData;
    } catch (error) {
        console.error('Error get mapel');
        throw error;
    }
}

async function uploadGamber(nama, nama_file, path){
    try {
        await db.upload_gambar.create({
            nama,
            nama_file,
            path,
            created_date: new Date
        });
    } catch (error) {
        console.error('Error when upload data');
        throw error;
    }
}

async function getImage(nama_file) {
    try {
        const imageFile = await db.upload_gambar.findOne({
            where :{
                nama: nama_file
            },
            raw: true,
        });
        if (!imageFile) {
            throw new Error('Image not found');
        }
        return imageFile;
    } catch (error) {
        
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
    getDataInduk,
    insertMapelBulkKelas,
    deleteMapel,
    getMapelForGuruUseKodeGuru,
    uploadGamber,
    getImage
}
const db = require('../db/models');
const { QueryTypes } = require('sequelize');

async function getFinalPenilaian(kodeGuru, kelas, idMapel) {
    try {
        const result =
                    `select b.id, b.nama_siswa, b.nisn, b.nilai, b.submit_date  as tanggal_submit from smknutulis.mapel a
                    join smknutulis.penilaian b
                    on a.kelas = b.kelas
                    and a.nama_mapel = b.mata_pelajaran
                    where a.kode_guru =:kodeGuru
                    and a.kelas =:kelas
                    and a.idmapel =:idMapel`;
                const responseData = await db.sequelize.query(result, {
                    replacements: {kodeGuru, kelas, idMapel},
                    type: db.Sequelize.QueryTypes.SELECT,
                });
        return responseData;
    } catch (error) {
        console.error('Error when get data final penilaian');
        throw error;
    }
}

async function getCountPenilaian(nisn, kelas) {
    try {
        const count  = await db.penilaian.count({
            where:{
                nisn,kelas
            },
            raw: true,
        });
        return count;
    } catch (error) {
        console.error('Error when get count data final penilaian');
        throw error;
    }
}

async function updateNilaiAkhirPenilaian(nilai, kelas, nisn){
    try {
        await db.penilaian.update(
            {nilai: nilai},
            {
                where:{
                    kelas,
                    nisn
                }
            }
        )
    } catch (error) {
        console.error('Error update nilai penilaiai siswa');
        throw error;
    }
}

module.exports = {
    getFinalPenilaian,
    getCountPenilaian,
    updateNilaiAkhirPenilaian
}
const db = require('../db/models');
const {Op, where} = require('sequelize');
const { QueryTypes } = require('sequelize');

async function insertIntoSoal(nomorSoal, kdMapel, kelas, txSoal, jenis_soal, available_on, skor){
    try {
        const existingSoal = await db.soal.findOne({
            where: {nomor_soal: nomorSoal, kode_mapel: kdMapel, kelas: kelas}
        });

        if (existingSoal) {
            throw new Error(`soal dengan nomor ${nomorSoal} sudah ada di kelas ${kelas} untuk mapel ${kdMapel}`);
        } else {
            console.log('skor: ', skor);
                await db.soal.create({
                nomor_soal: nomorSoal,
                kode_mapel: kdMapel,
                kelas,
                text_soal: txSoal,
                jenis_soal,
                created_date: new Date,
                available_on: available_on,
                skor
            });
            // return soalinput.get({ plain: true });
            return {
                responses: 'Success add soal',
                idmapel: kdMapel,
                kelas: kelas
            }
        }
        
    } catch (error) {
        console.error('Error when inserting data soal');
        throw new Error(error.message);
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

async function insertIntoJawaban(kdMapel, nomorSoal, jawaban, jenis_soal, kelas, skor) {
    try {
        await db.essay.create({
            kode_mapel: kdMapel,
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

async function getSoal(kode_mapel, kelas){
    try {
        const soal = await db.soal.findAll({
            where:{
                kode_mapel,
                kelas,
            },
            order:[['nomor_soal','ASC']],
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

async function getPilgan(kode_mapel,nomor_soal, kelas){
    try {
        const pilgan = await db.pilihan_ganda.findAll({
            where:{
                kode_mapel,
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

async function getAvailableTest(kelas, nisn) {
    try{
        const result = await db.sequelize.query(`
            select as2.status_available, m.idmapel, m.nama_mapel, m.guru_pengampu from assign_soal as2 
            join mapel m on
            m.idmapel = as2.kd_mapel 
            where as2.kelas = :kelas
            and as2.nisn = :nisn`,
            {
                replacements: {
                kelas: kelas,
                nisn: nisn
            },
            type: QueryTypes.SELECT
        });
        return result;
        // const dataAvail = await db.assign_soal.findOne({
        //     where : {
        //         kelas,
        //         nisn
        //     },
        //     raw: true,
        // })
        // return dataAvail;
    }catch(error){
        console.error('Error when get available test');
        throw error;
    }
}

async function updateStatusSoal(kelas , nisn){
    try {
        await db.assign_soal.update(
            { status_available: 0 }, // Set status to 1
            {
                where: {
                    kelas: kelas,
                    nisn: nisn
                }
            }
        );
    } catch (error) {
        console.error('Error when update status soal');
        throw new error.message;
    }
}

async function getSoalByKodeAndNomor(id_mapel, nomor_soal, kelas){
    try {
        const existingSoal = await db.soal.findOne({
            where: {nomor_soal, kode_mapel: id_mapel, kelas
            },
            raw: true,
        });
        return existingSoal;
    } catch (error) {
        console.error('Error when get data');
        throw new error.message;
    }
}

async function updateTextSoal(text_soal, id_mapel, nomor_soal, kelas, skor){
    try {
        console.log('nilai skor payload: ', skor);
        let skors = skor != null ? skor : 0;
        console.log('nilai skor: ', skors);
        await db.soal.update(
            {
                text_soal,
                skor: skors
            },
        {
            where: {
                kode_mapel: id_mapel,
                nomor_soal,
                kelas
            }
        })
        return {
            responses: 'Success Update soal'
        }
    } catch (error) {
        console.error('Error when update soal');
        throw new error.message;
    }
}

async function deletePilihanGanda(kode_mapel, nomor_soal, kelas){
    try {
        await db.pilihan_ganda.destroy({
            where: {
                kode_mapel,
                nomor_soal,
                kelas
            }
        })
    } catch (error) {
        console.error('Error when delete soal');
        throw new error.message;
    }
}

async function getJawabanEssay(kode_mapel, jenis_soal, nomor_soal, kelas){
    try {
        const jawabanessay = await db.essay.findOne({
            where:{
                kode_mapel,
                jenis_soal,
                nomor_soal,
                kelas
            },
            raw: true,
        });
        console.log('jawaban essay repo : ', jawabanessay);
        return jawabanessay;
    } catch (error) {
        console.error('Error when get jawaban essay');
        throw new error.message;
    }
}

async function updateJawabanEssay(jawaban, kode_mapel, jenis_soal, nomor_soal, kelas){
    try {
        await db.essay.update(
            {jawaban},
            {
                where:{
                    kode_mapel,
                    jenis_soal,
                    nomor_soal,
                    kelas
                }
            }
        )
    } catch (error) {
        console.error('Error update jawaban');
        throw new error.message;
    }
}

async function getJawabanEssayB(kode_mapel, nomor_soal, kelas){
    try {
        const jawabanEssay = await db.essay.findOne({
            where: {
                kode_mapel,
                nomor_soal,
                kelas
            }, 
            raw: true,
        });
        return jawabanEssay;
    } catch (error) {
        console.error('Error get jawaban essay');
        throw new error.message;
    }
}

async function deleteEssay(kode_soal, nomor_soal, kelas){
    try {
        await db.essay.destroy({
            where : {
                kode_soal,
                nomor_soal,
                kelas
            }
        })
    } catch (error) {
        console.error('Error delete essay');
        throw new error.message;
    }
}

async function deleteSoal(nomor_soal, kode_mapel, jenis_soal, kelas){
    try {
        await db.soal.destroy({
            where: {
                nomor_soal,
                kode_mapel,
                jenis_soal,
                kelas
            }
        })
    } catch (error) {
        console.error('Error  delete  soal');
        throw new error.message;
    }
}

async function getSkor(nomor_soal, kode_mapel, kelas, pilihan_benar){
    try {
        const getSkor = await db.pilihan_ganda.findOne({
            where: {
                nomor_soal, kode_mapel, kelas, pilihan_benar
            },
            raw: true,
        });
        return getSkor;
    } catch (error) {
        console.error('Error get skor');
        throw new error.message;
    }
}

async function getDataJawabanSiswa(kelas, idmapel, nisn, kode_guru){
    try {
        const result = await db.sequelize.query(`
            SELECT a.id, a.nama_siswa, a.kelas, a.nisn, c.nama_mapel, a.idmapel, a.nomor_soal, a.jenis_soal, a.text_soal, a.jawaban, a.skor
            FROM data_jawaban_siswa a
            JOIN mapel c ON c.idmapel = a.idmapel
            JOIN account_guru_karyawan b ON b.kode_guru = c.kode_guru
            WHERE c.idmapel = :idmapel
            AND a.kelas = :kelas
            AND a.nisn = :nisn
            AND b.kode_guru = :kode_guru`,
            {
                replacements: {
                idmapel: idmapel,
                kelas: kelas,
                nisn: nisn,
                kode_guru: kode_guru
            },
            type: QueryTypes.SELECT
        });
        return result;
    } catch (error) {
        console.error('error get data jawaban siswa');
        throw error;
    }
}

async function updateSkorJawabanSiswa(kelas, nisn, kode_soal, nomor_soal, skor){
    try {
        await db.data_jawaban_siswa.update(
            {skor: skor},
            {
                where:{
                    kelas,
                    nisn,
                    kode_soal,
                    nomor_soal
                }
            }
        )
    } catch (error) {
        console.error('Error update skor jawaban siswa');
        throw error;
    }
}

async function sumSkorJawabanSiswa(nisn, idmapel, kode_soal){
    try {
        const query = `select 
                sum(skor) skor,
                b.nama_mapel,
                c.nama ,
                c.rombel_saat_ini 
                from data_jawaban_siswa a 
                join mapel b on 
                a.idmapel = b.idmapel
                join data_induk c on
                a.nisn = c.nisn 
                where c.nisn = :nisn
                and a.idmapel = :idmapel`;
        const responseData = await db.sequelize.query(query, {
            replacements: {nisn,  idmapel, kode_soal},
            type: db.Sequelize.QueryTypes.SELECT,
        });
        return responseData;
    } catch (error) {
        console.error('Error Get Sum Skor');
        throw error;
    }
}

async function insertPenilaianSiswa(nama_siswa, kelas, nisn, mata_pelajaran, nilai) {
    try {
        await db.penilaian.create({
            nama_siswa,
            kelas,
            nisn,
            mata_pelajaran,
            nilai,
            submit_date: new Date
        });
    } catch (error) {
        console.error('Error when inserting data ');
        throw error;
    }
}

async function getAnalisisJawabanSiswa(kelas, idmapel){
    try {
        const query = `SELECT
                            a.nomor_soal AS no, -- Gantilah dengan ID yang sesuai atau tambahkan kolom yang diperlukan
                            a.nama_siswa AS nama,
                            a.kelas,
                            b.nama_mapel AS soal,
                            GROUP_CONCAT(a.jawaban ORDER BY a.nomor_soal) AS jawaban
                        FROM
                            data_jawaban_siswa a
                        JOIN
                            mapel b ON a.idmapel = b.idmapel
                            and a.kelas = b.kelas       
                        WHERE
                            a.kelas = :kelas
                            and a.idmapel = :idmapel
                        GROUP BY
                            a.nama_siswa, a.kelas, b.nama_mapel`;
        const responseData = await db.sequelize.query(query, {
            replacements: {kelas, idmapel},
            type: db.Sequelize.QueryTypes.SELECT,
        });

        const query2 = `SELECT
                distinct (a.nomor_soal) AS no
            FROM
                data_jawaban_siswa a
            JOIN
                mapel b ON a.idmapel = b.idmapel
                and a.kelas = b.kelas
            WHERE
                a.kelas = :kelas
                and a.idmapel = :idmapel`;
        const responseData2 = await db.sequelize.query(query2, {
        replacements: {kelas, idmapel},
        type: db.Sequelize.QueryTypes.SELECT,
        });

        // Proses responseData untuk mengubah jawaban dan kategori menjadi array
        const formattedResponse = responseData.map((row, index) => ({
            no: row.no, // No from responseData
            nama: row.nama,
            kelas: row.kelas,
            mapel: row.soal,
            jawaban: row.jawaban
                ? row.jawaban.split(",").map((answer, idx) => ({
                    no: responseData2[idx]?.no || idx + 1, // Take nomor_soal from responseData2, default to idx if not found
                    jawaban: answer.trim().toUpperCase() // Convert to uppercase if needed
                }))
                : []
        }));

        return formattedResponse;
    } catch (error) {
        console.error('Error Analisis Jawaban Siswa');
        throw error;
    }
}

async function kategoriSoal(kelas, idmapel){
    try {
        const  query = `SELECT 
                            a.nomor_soal,
                            CASE 
                                WHEN (COUNT(CASE WHEN a.skor = 10 THEN 1 END) * 100.0 / COUNT(*)) > 70 THEN 'mudah'
                                WHEN (COUNT(CASE WHEN a.skor = 10 THEN 1 END) * 100.0 / COUNT(*)) BETWEEN 50 AND 70 THEN 'sedang'
                                ELSE 'sulit'
                            END AS kategori_soal,
                            COUNT(a.skor) AS total_responses,
                            COUNT(CASE WHEN a.skor = 10 THEN 1 END) AS correct_responses
                        FROM 
                            data_jawaban_siswa a
                        WHERE 
                            a.kelas = :kelas
                            and a.idmapel = :idmapel
                        GROUP BY 
                            a.nomor_soal;`;
        const responseData = await db.sequelize.query(query, {
            replacements: {kelas, idmapel},
            type: db.Sequelize.QueryTypes.SELECT,
        });

        return responseData;
    } catch (error) {
        console.error('Error kategori soal');
        throw error;
    }
}

async function insertAnalisisJawabanSiswa(kelas, kode_soal, nomor_soal, jenis_soal, kategori_soal) {
    try {
        await db.analisis_jawaban.create({
            kelas,
            kode_soal,
            nomor_soal,
            jenis_soal,
            kategori_soal,
        });
    } catch (error) {
        console.error('Error when inserting data ');
        throw error;
    }
}

async function getKategoriJawaban(kelas, idmapel) {
    try {
        const kategori = await db.analisis_jawaban.findAll({
            where: {kelas, kode_soal: idmapel},
            attributes: ['nomor_soal', 'kategori_soal'],
            raw: true
        });
        return kategori;
    } catch (error) {
        console.error('Error get kategori jawaban');
        throw error;
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
    updateStatusSoal,
    getSoalByKodeAndNomor,
    updateTextSoal,
    deletePilihanGanda,
    getJawabanEssayB,
    updateJawabanEssay,
    getJawabanEssay,
    deleteEssay,
    deleteSoal,
    getSkor,
    getDataJawabanSiswa,
    updateSkorJawabanSiswa,
    sumSkorJawabanSiswa,
    insertPenilaianSiswa,
    getAnalisisJawabanSiswa,
    kategoriSoal,
    insertAnalisisJawabanSiswa,
    getKategoriJawaban
}
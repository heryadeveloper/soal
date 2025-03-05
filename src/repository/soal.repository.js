const { type } = require('@hapi/joi/lib/extend');
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


async function getBenarsalah(kode_soal,nomor_soal, kelas){
    try {
        const benarsalah = await db.benarsalah.findOne({
            where:{
                kode_mapel: kode_soal,
                nomor_soal,
                kelas
            },
            raw: true,
        });
        return benarsalah;
    } catch (error) {
        console.error('Error when get benarsalah', error);
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
            and m.kelas = as2.kelas  
            where as2.kelas = :kelas
            and as2.nisn = :nisn
            and NOW() >= as2.created_date`,
            {
                replacements: {
                kelas: kelas,
                nisn: nisn
            },
            type: QueryTypes.SELECT
        });
        return result;
    }catch(error){
        console.error('Error when get available test');
        throw error;
    }
}


async function getMatchingAnswer(kode_mapel, jenis_soal, kelas) {
    try {
        const result = await db.sequelize.query(`
            select * from comparation c where c.kode_mapel = :kode_mapel and c.jenis_soal = :jenis_soal and c.kelas = :kelas`,
        {
            replacements: {
                kode_mapel: kode_mapel,
                jenis_soal: jenis_soal,
                kelas : kelas
            },
            type: QueryTypes.SELECT
        });
        return result;
    } catch (error) {
        console.error('Error when get matching answer');
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
            where: {
                nomor_soal, 
                kode_mapel: id_mapel, 
                kelas
            },
            raw: true,
        });
        return existingSoal;
    } catch (error) {
        console.error('Error when get data');
        throw error;
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

async function getSkor( kode_mapel, nomor_soal, kelas, pilihan_benar){
    try {
        const getSkor = await db.pilihan_ganda.findOne({
            where: {
                kode_mapel, nomor_soal, kelas, pilihan_benar
            },
            raw: true,
        });
        return getSkor;
    } catch (error) {
        console.error('Error get skor');
        throw new error.message;
    }
}

async function getSkorBenarSalah( nomor_soal, kelas, jawaban){
    try {
        const getSkor = await db.benarsalah.findOne({
            where: {
                nomor_soal, kelas, jawaban
            },
            raw: true,
        });
        return getSkor;
    } catch (error) {
        console.error('Error get skor');
        throw new error.message;
    }
}

async function getSkorMatchingAnswer( nomor, kelas, id_jawaban_benar){
    try {
        const getSkor = await db.matching_answer.findOne({
            where: {
                nomor, kelas, id_jawaban_benar
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
            SELECT a.id, a.nama_siswa, a.kelas, a.nisn, c.nama_mapel, a.idmapel, a.nomor_soal, a.jenis_soal, 
            case
                when a.jenis_soal = 0 then 'Pillihan Ganda'
                when a.jenis_soal = 1 then 'Essay'
                when a.jenis_soal = 2 then 'Menjodohkan'
                when a.jenis_soal = 3 then 'Benar Salah'
            end as jenis,
            a.text_soal, a.jawaban, a.skor
            FROM data_jawaban_siswa a
            JOIN mapel c ON c.idmapel = a.idmapel and c.kelas = a.kelas
            JOIN account_guru_karyawan b ON b.kode_guru = c.kode_guru
            WHERE c.idmapel = :idmapel
            AND a.kelas = :kelas
            AND a.nisn = :nisn
            AND b.kode_guru = :kode_guru
            order by a.nomor_soal ASC`,
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

async function updateSkorJawabanSiswa(kelas, nisn, idmapel, nomor_soal, skor){
    try {
        await db.data_jawaban_siswa.update(
            {skor: skor},
            {
                where:{
                    kelas,
                    nisn,
                    idmapel,
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
                and a.kelas = b.kelas
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
                            and a.jenis_soal =0
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
                            and a.jenis_soal = 0
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

async function insertMatchingQuestion(mencocokan){
    console.log("mencocokan");
    try {

        // Buat placeholder dinamis berdasarkan jumlah data
        const placeholders = mencocokan.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ');

        const query = `
            INSERT INTO matching_question (kode_mapel, nomor_soal, jenis_soal, text_soal, id_jawaban_benar, created_at, kelas)
            VALUES ${placeholders}
            ON DUPLICATE KEY UPDATE
                nomor_soal = VALUES(nomor_soal),
                text_soal = VALUES(text_soal),
                id_jawaban_benar = VALUES(id_jawaban_benar),
                kelas = VALUES(kelas);
        `;


       // Ratakan data untuk menggantikan placeholder
        const values = mencocokan.flatMap(item => [
            item.kode_mapel,
            item.nomor_soal,
            item.jenis_soal,
            item.text_soal,
            item.id_jawaban_benar,
            item.created_at,
            item.kelas
        ]);

        console.log(values);

        // Eksekusi query
        await db.query(query, { replacements: values, type: QueryTypes.INSERT });

        console.log('Data berhasil di-insert atau di-update');

    } catch (error) {
        console.error('Error when inserting data', error);
        throw error;
    }
}


async function insertIntomatchingAnswerBulk(mencocokan){
    try {

        // Buat placeholder dinamis berdasarkan jumlah data
        const placeholders = mencocokan.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ');

        const query = `
            INSERT INTO matching_answer (nomor, jenis_soal, jawaban, skor, created_at, kelas, id_jawaban_benar)
            VALUES ${placeholders}
            ON DUPLICATE KEY UPDATE
                nomor = VALUES(nomor),
                jawaban = VALUES(jawaban),
                skor = VALUES(skor),
                id_jawaban_benar = VALUES(id_jawaban_benar),
                kelas = VALUES(kelas);
        `;


       // Ratakan data untuk menggantikan placeholder
        const values = mencocokan.flatMap(item => [
            item.nomor,
            item.jenis_soal,
            item.jawaban,
            item.skor,
            item.created_at,
            item.kelas,
            item.id_jawaban_benar
        ]);

        // Eksekusi query
        await db.query(query, { replacements: values, type: QueryTypes.INSERT });

        console.log('Data berhasil di-insert atau di-update');

    } catch (error) {
        console.error('Error when inserting data', error);
        throw error;
    }
}



async function insertJawabanBenarSalah(kode_mapel, nomor_soal, jenis_soal, textsoal, jawaban, kelas, skor) {
    try {
        await db.benarsalah.create({
            kode_mapel,
            nomor_soal,
            jenis_soal,
            textsoal,
            jawaban,
            created_at: new Date(),
            kelas,
            skor
        });
    } catch (error) {
        console.error('Error when inserting data ');
        throw error;
    }
}

async function getJawabanBenarSalah(kode_mapel, nomor_soal, jenis_soal, kelas){
    try {
        const jawabanessay = await db.essay.findOne({
            where:{
                kode_mapel,
                nomor_soal,
                jenis_soal,
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


async function updateJawabanBenarSalah(jawaban, kode_mapel, jenis_soal, nomor_soal, kelas){
    try {
        await db.benarsalah.update(
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

async function getMatchingQuestion(kode_mapel, kelas) {
    try {
        const matchingQuestion = await db.matching_question.findAll({
            where:{
                kode_mapel,
                kelas
            },
            raw: true,
        });
        return matchingQuestion;
    } catch (error) {
        console.error('Error when get matching question', error);
        throw error;
    }
    
}

async function getMatchingAnswered(kelas) {
    try {
        const matchingAnswer = await db.matching_answer.findAll({
            where:{
                kelas,
            },
            raw: true,
        });
        return matchingAnswer;
    } catch (error) {
        console.error('Error when get matching answered');
        throw error;
    }
}

async function getPreviewSoal(kelas, idmapel) {
    try {
        const kelasArray = Array.isArray(kelas) ? kelas : kelas.split(",");

        const  query = `select s.nomor_soal , m.nama_mapel ,
                        case
                            when s.jenis_soal = 0 then "Pilihan Ganda"
                            when s.jenis_soal = 1 then "Essay"
                            when s.jenis_soal = 2 then "Menjodohkan"
                            when s.jenis_soal = 3 then "Benar Salah"
                        end as jenis,
                        s.text_soal , s.skor  from
                        soal s join mapel m
                        on s.kode_mapel  = m.idmapel
                        and s.kelas = m.kelas
                        where s.kelas in (:kelas)
                        and m.idmapel = :idmapel
                        GROUP BY s.nomor_soal, m.nama_mapel, s.jenis_soal, s.text_soal, s.skor
                        order by s.nomor_soal asc;
                        `;
        const responseData = await db.sequelize.query(query, {
            replacements: {
                kelas: kelasArray,
                idmapel
            },
            type: db.Sequelize.QueryTypes.SELECT,
        });

        return responseData;
    } catch (error) {
        console.error('Error get preview soal');
        throw error;
    }
}

async function getStatusPengerjaan(kelas, tahun_ajaran, idmapel) {
    try {
        const query =`select
                    a.id,
                    b.nama,
                    a.kelas ,
                    case
                        when a.status_available = 0 then 'Sudah'
                        when a.status_available = 1 then 'Belum'
                    end as status
                    from assign_soal a
                    join data_induk b
                    on a.nisn = b.nisn
                    join mapel c
                    on a.kd_mapel = c.idmapel
                    and a.kelas = c.kelas
                    where a.kelas = :kelas
                    and b.tahun_ajaran = :tahun_ajaran
                    and c.idmapel =:idmapel`;
        const responseData = await db.sequelize.query(query, {
            replacements: {kelas, tahun_ajaran, idmapel},
            type: db.Sequelize.QueryTypes.SELECT,
        });

        return responseData;
    } catch (error) {
        console.error('Error get data status', error);
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
    getSkorBenarSalah,
    getSkorMatchingAnswer,
    getDataJawabanSiswa,
    updateSkorJawabanSiswa,
    sumSkorJawabanSiswa,
    insertPenilaianSiswa,
    getAnalisisJawabanSiswa,
    kategoriSoal,
    insertAnalisisJawabanSiswa,
    getKategoriJawaban,
    getMatchingAnswer,
    getBenarsalah,
    insertIntomatchingAnswerBulk,
    insertMatchingQuestion,
    insertJawabanBenarSalah,
    getJawabanBenarSalah,
    updateJawabanBenarSalah,
    getMatchingQuestion,
    getMatchingAnswered,
    getPreviewSoal,
    getStatusPengerjaan
}
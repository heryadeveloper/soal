const { soalRepository, mapelRepository } = require("../repository");

async function getSoal(req){
    const {idmapel, kelas} = req.query;
    try {
        const getSoals = await soalRepository.getSoal(idmapel, kelas);


        const data = await Promise.all(
            getSoals.map(async (soal) => {
                let pilihan = null;
                
                // Hanya ambil pilihan jika soal jenisnya pilihan ganda (jenis_soal === 0)
                if (soal.jenis_soal === 0) {
                    pilihan = await soalRepository.getPilgan(soal.kode_soal,soal.nomor_soal, soal.kelas);

                    // Ubah data pilihan menjadi bentuk yang diinginkan
                    pilihan = pilihan.map((jawaban) => ({
                        idx_pilihan: jawaban.idx_pilihan,
                        soal_pilihan: jawaban.pilihan,
                    }));
                }

                const pilihan_ganda = soal.jenis_soal === 0 && pilihan != null ? pilihan : null;

                
                return {
                    kode_soal: soal.kode_soal,
                    nomor_soal: soal.nomor_soal,
                    kode_mapel: soal.kode_mapel,
                    jenis_soal: soal.jenis_soal,
                    kelas: soal.kelas,
                    text_soal: soal.text_soal,
                    pilihan_ganda
                };
            })
        );

        return data;
    } catch (error) {
        console.error('Error in service soal', error);
        throw error;
    }
}

async function getSoalEssay(req){
    const {idmapel,nomor_soal, kelas, jenis_soal} = req.query;
    try {
        const getSoals = await soalRepository.getSoalEssay(idmapel,nomor_soal, kelas, jenis_soal);
        return getSoals;
    } catch (error) {
        console.error('Error in service soal', error);
        throw error;
    }
}

async function getPilgan(req){
    const {kode_mapel, kelas} = req.query;
    try {
        const getPilgans = await soalRepository.getPilgan(kode_mapel, kelas);
        return getPilgans;
    } catch (error) {
        console.error('Error in service pilgan', error);
        throw error;
    }
}

async function getEssay(req){
    const {kode_mapel, kelas} = req.query;
    try {
        const getEssays = await soalRepository.getEssay(kode_mapel, kelas);
        return getEssays;
    } catch (error) {
        console.error('Error in service pilgan', error);
        throw error;
    }
}

async function inputSoalHandler(req){
    try {
        const {nama_mapel, id_mapel, kelas, kode_soal, nomor_soal, jenis_soal, available_on, text_soal, text_jawaban} = req.body;
        // get mapel, if not in table, insert first
        const mapelInTable = await mapelRepository.getDataMapelForOne(id_mapel);
        console.log('mapel in table : ', mapelInTable.nama_mapel);

        if (!mapelInTable) {
            // insert parent table (mapel)
            await mapelRepository.insertDataMapel(id_mapel, nama_mapel, kelas);

        } else {
            // insert into child 1 (soal)
        const soalinput = await soalRepository.insertIntoSoal(kode_soal, nomor_soal, id_mapel, kelas, text_soal, jenis_soal, available_on);

        //logic save jawaban using pilgan or essay
        if (jenis_soal === 0) {
            // save jawaban ke table pilihan
            const jawabanPilihanGanda = text_jawaban.pilihan_ganda.map(jawaban =>({
                kode_soal: kode_soal,
                nomor_soal: nomor_soal,
                pilihan: jawaban.pilihan,
                idx_pilihan: jawaban.idx_pilihan,
                kelas: kelas,
                pilihan_benar: jawaban.pilihan_benar,
                skor: jawaban.skor
            }))
            await soalRepository.insertIntoPilihanBulk(jawabanPilihanGanda);
        } else {
            await soalRepository.insertIntoJawaban(kode_soal, nomor_soal, text_jawaban.essay.jawaban, jenis_soal, kelas, text_jawaban.essay.skor);
        }

        return soalinput;
        }
        
        
    } catch (error) {
        console.error('Error in service input soal handler', error);
        throw error;
    }
}

async function inputJawabanSiswa(req){
    try {
        const { payload } = req.body;
        const jawabanDataSiswaList = [];
        for (let jawaban of payload){
            const {
                nama_siswa,
                nisn,
                kelas,
                idmapel,
                kode_soal,
                nomor_soal,
                jenis_soal,
                text_soal,
                jawaban: { idx_pilihan, text_jawaban },
                skor
            } = jawaban;

            const jawabanObj = {
                nama_siswa,
                nisn,
                kelas,
                idmapel,
                kode_soal,
                nomor_soal,
                jenis_soal,
                text_soal,
                skor,
            };

             // Handle multiple-choice or essay based on jenis_soal
            if (jenis_soal === 0) {
                // Multiple-choice: Use idx_pilihan
                jawabanObj.jawaban = idx_pilihan;
            } else if (jenis_soal === 1) {
                // Essay: Use text_jawaban
                jawabanObj.jawaban = text_jawaban;
            }

            // Push each jawabanObj into the jawabanDataSiswa array
            jawabanDataSiswaList.push(jawabanObj);

            // update status soal into 1 after success insert jawab
            await soalRepository.updateStatusSoal(kode_soal, kode_soal, kelas);
        }
        await soalRepository.insertJawabanSiswaBulk(jawabanDataSiswaList);

        

        return jawabanDataSiswaList;
    } catch (error) {
        console.error('Error in service input jawaban siswa', error);

        if (error.code === 'ER_DUP_ENTRY') {
            console.error('Duplicate entry error:', error.message);
        } else {
            console.error('Other error:', error.message);
        }
    
        // If needed, you can throw the error again or handle it in some way
        throw new Error('Database operation failed: ' + error.message);
    }
}

async function getAvailableTest(req) {
    const {kelas} = req.query;
    try {
        const availableTest = await soalRepository.getAvailableTest(kelas);
        return availableTest;
    } catch (error) {
        console.error('Error Service Get Available test', error);
        throw error;
    }
}


module.exports = {
    getSoal,
    getSoalEssay,
    getPilgan,
    getEssay,
    inputSoalHandler,
    inputJawabanSiswa,
    getAvailableTest
}


const { soalRepository, mapelRepository } = require("../repository");

async function getSoal(req){
    const {idmapel, kelas} = req.query;
    try {

        const mapelInTable = await mapelRepository.getDataMapelForOne(idmapel);

        const getSoals = await soalRepository.getSoal(idmapel, kelas);


        const data = await Promise.all(
            getSoals.map(async (soal) => {
                let pilihan = null;
                let jawabanEssay = null
                
                // Hanya ambil pilihan jika soal jenisnya pilihan ganda (jenis_soal === 0)
                if (soal.jenis_soal === 0) {
                    pilihan = await soalRepository.getPilgan(soal.kode_mapel,soal.nomor_soal, soal.kelas);

                    // Ubah data pilihan menjadi bentuk yang diinginkan
                    pilihan = pilihan.map((jawaban) => ({
                        idx_pilihan: jawaban.idx_pilihan,
                        pilihan: jawaban.pilihan,
                        pilihan_benar: jawaban.pilihan_benar,
                        skor: jawaban.skor
                    }));
                } else {
                    jawabanEssay = await soalRepository.getJawabanEssayB(soal.kode_mapel,soal.nomor_soal, soal.kelas);
                }

                const pilihan_ganda = soal.jenis_soal === 0 && pilihan != null ? pilihan : null;
                const jawaban_essay = soal.jenis_soal === 1 && jawabanEssay != null ? jawabanEssay : null;

                
                return {
                    nama_mapel: mapelInTable.nama_mapel,
                    id_mapel: mapelInTable.idmapel,
                    nomor_soal: soal.nomor_soal,
                    kode_mapel: soal.kode_mapel,
                    jenis_soal: soal.jenis_soal,
                    kelas: soal.kelas,
                    text_soal: soal.text_soal,
                    skor: soal.skor,
                    pilihan_ganda,
                    jawaban_essay
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
        const {nama_mapel, id_mapel, kelas, nomor_soal, jenis_soal, available_on, skor, text_soal, text_jawaban} = req.body;
        // get mapel, if not in table, insert first
        const mapelInTable = await mapelRepository.getDataMapelForOne(id_mapel);
        const assignStatus = await mapelRepository.getMapelAssignForClass(id_mapel, kelas);

        if (!mapelInTable) {
            // insert parent table (mapel)
            await mapelRepository.insertDataMapel(id_mapel, nama_mapel, kelas);

        } else {

            const existingSoal = await soalRepository.getSoalByKodeAndNomor(id_mapel, nomor_soal, kelas);
            let soalInput;
            if (existingSoal) {
                console.log('existing')
                // if soal exist update the soal
                soalInput = await soalRepository.updateTextSoal(text_soal, id_mapel, nomor_soal, kelas, skor);
            } else {
                 // insert into child 1 (soal)
                console.log('baru')
                soalInput = await soalRepository.insertIntoSoal(nomor_soal, id_mapel, kelas, text_soal, jenis_soal, available_on, skor);
            }
        //logic save jawaban using pilgan or essay
        if (jenis_soal === 0) {
            // save jawaban ke table pilihan
            const jawabanPilihanGanda = text_jawaban.pilihan_ganda.map(jawaban =>({
                kode_mapel: id_mapel,
                nomor_soal: nomor_soal,
                pilihan: jawaban.pilihan,
                idx_pilihan: jawaban.idx_pilihan,
                kelas: kelas,
                pilihan_benar: jawaban.pilihan_benar,
                skor: jawaban.skor
            }))

            console.log('delete pilihan');
            // first, delete existing pilihan for the soal if it exist
            await soalRepository.deletePilihanGanda(id_mapel, nomor_soal, kelas);

            await soalRepository.insertIntoPilihanBulk(jawabanPilihanGanda);
        } else {
            const existingEssayJawaban = await soalRepository.getJawabanEssay(id_mapel, jenis_soal, nomor_soal, kelas);
            
            console.log('data essay jawaban: ', existingEssayJawaban);

            if (existingEssayJawaban) {
                await soalRepository.updateJawabanEssay(text_jawaban.essay.jawaban, id_mapel, jenis_soal, nomor_soal, kelas);
            } else {
                console.log('insert jawaban essay: kode soal: ', id_mapel);
                await soalRepository.insertIntoJawaban(id_mapel, nomor_soal, text_jawaban.essay.jawaban, jenis_soal, kelas, text_jawaban.essay.skor);
            }
        }
        //asiggn soal into kelas
        if (!assignStatus) {
            //initiate data from data_induk first
            const nisnSiswa = await mapelRepository.getDataInduk(kelas, '2024');
            const nisnBulk = nisnSiswa.map(nisns => ({
                kd_mapel: id_mapel,
                kelas: kelas,
                status_available: 1,
                nisn: nisns.nisn
            }))
            console.log('nisn bulk : ', nisnBulk);
            await mapelRepository.insertAssignSoalBulk(nisnBulk);
            // await mapelRepository.insertAssignSoal(kode_soal, id_mapel, kelas, 1);
        }

        return soalInput;
        }
        
    } catch (error) {
        console.error('Error in service input soal handler', error);
        throw new Error(error.message);
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
                nomor_soal,
                jenis_soal,
                text_soal,
                skor,
            };

             // Handle multiple-choice or essay based on jenis_soal
            if (jenis_soal === 0) {
                //jika jawaban pilihan ganda mesti cek terlebihh dahulu untuk point yang di dapatkan jika berhasil menjawab dengn benar
                const getSkor = await soalRepository.getSkor(idmapel, nomor_soal, kelas, 1);
                console.log('idx pilihan: ', idx_pilihan);
                if (getSkor.idx_pilihan === idx_pilihan) {
                    jawabanObj.skor = getSkor.skor;
                }else{
                    jawabanObj.skor = 0;
                }

                // Multiple-choice: Use idx_pilihan
                jawabanObj.jawaban = idx_pilihan;
            } else if (jenis_soal === 1) {
                // Essay: Use text_jawaban
                jawabanObj.jawaban = text_jawaban;
            }

            // Push each jawabanObj into the jawabanDataSiswa array
            jawabanDataSiswaList.push(jawabanObj);

            // update status soal into 1 after success insert jawab
            await soalRepository.updateStatusSoal(kelas, nisn);
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
        throw new Error('Database operation failed: ' + error);
    }
}

async function getAvailableTest(req) {
    const {kelas, nisn} = req.query;
    try {
        const availableTest = await soalRepository.getAvailableTest(kelas, nisn);
        return availableTest;
    } catch (error) {
        console.error('Error Service Get Available test', error);
        throw error;
    }
}

async function deleteSoal(req){
    const {nomor_soal, kode_mapel, jenis_soal, kelas} = req.body;
    try{
        if (jenis_soal === 0) {
            await soalRepository.deletePilihanGanda(kode_mapel, nomor_soal, kelas);
        } else {
            await soalRepository.deleteEssay(kode_mapel, nomor_soal, kelas);
        }
            await soalRepository.deleteSoal(nomor_soal, kode_mapel, jenis_soal, kelas);
        return {
            nomor_soal,
            jenis_soal,
            kelas
        }
    }catch(error){
        console.error('Error Service Delete Soal', error);
        throw error;
    }
}
async function getDataJawabanSiswa(req){
    const {kelas, idmapel, nisn, kode_guru} = req.query;
    try {
        const data = await soalRepository.getDataJawabanSiswa(kelas, idmapel, nisn, kode_guru);
        return data;
    } catch (error) {
        console.error('Error Service get data jawaban siswa', error);
        throw error;
    }
}

async function updateSkorJawabanSiswa(req) {
    try {
        const { payload } = req.body;
        // Gunakan Promise.all untuk menunggu semua update selesai
        await Promise.all(payload.map(async (payloads) => {
            const { skor, kelas, nisn, kode_soal, nomor_soal } = payloads;
            // Lakukan update untuk setiap jawaban siswa
            await soalRepository.updateSkorJawabanSiswa(kelas, nisn, kode_soal, nomor_soal, skor);
        }));
        return {
            responseData: 'Success Update Skor Siswa'
        }
    } catch (error) {
        console.error('Error in service upadte jawaban siswa', error);
        throw error;
    }
}

async function sumSkorJawabanSiswa(req){
    try {
        const { nisn, idmapel, kode_soal} = req.query;
        const data = await soalRepository.sumSkorJawabanSiswa(nisn, idmapel, kode_soal);
        //insert ke dalam penilaian siswa
        await soalRepository.insertPenilaianSiswa(data[0].nama, data[0].rombel_saat_ini, nisn, data[0].nama_mapel, data[0].skor);
        return data;
    } catch (error) {
        console.error('Error Sum Skor Nilai Siswa', error);
        throw error;
    }
}

async function analisisJawabanSiswa(req){
    try {
        const {kelas, idmapel} = req.query;
        const data = await soalRepository.getAnalisisJawabanSiswa(kelas, idmapel);
        const kategori = await soalRepository.getKategoriJawaban(kelas, idmapel);
        return {
            data_jawaban: data,
            kategori
        };
    } catch (error) {
        console.error('Error Analisis Jawaban Siswa', error);
        throw error;
    }
}

async function insertAnalisisJawabanSiswa(req) {
    try {
        const {kelas, idmapel} = req.body;
        // query ke data-jawban-siswa
        // looping disctinct no
        // query untuk menentukan kategori
        const data = await soalRepository.kategoriSoal(kelas, idmapel);
        console.log('data analisis kategori: ', data.nomor_soal);
        for (let analis of data) {
            console.log('oleh data : ', analis.nomor_soal);
            await soalRepository.insertAnalisisJawabanSiswa(kelas,idmapel, analis.nomor_soal, 'pilihan_ganda', analis.kategori_soal);
        }
       

        return data;
    
    } catch (error) {
        console.error('Error Insert Analisis Jawaban Siswa: ', error);
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
    getAvailableTest,
    deleteSoal,
    getDataJawabanSiswa,
    updateSkorJawabanSiswa,
    sumSkorJawabanSiswa,
    analisisJawabanSiswa,
    insertAnalisisJawabanSiswa
}


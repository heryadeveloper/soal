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
                let comparation = null
                let trueandfalse = null
                let matchingquestion = null
                let matchinganswer = null
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
                }
                else if (soal.jenis_soal === 2) {
                    // comparation = await so/alRepository.getMatchingAnswer(soal.kode_mapel, soal.jenis_soal, soal.kelas)
                    matchingquestion = await soalRepository.getMatchingQuestion(soal.kode_mapel, soal.kelas);
                    matchinganswer = await soalRepository.getMatchingAnswered(soal.kelas);
                    console.log('matching answere', matchinganswer);
                    
                    const pernyataan = matchingquestion.map((result) => ({
                        id: result.id,
                        nomor_soal: result.nomor_soal,
                        text_soal: result.text_soal,
                        id_jawaban_benar: result.id_jawaban_benar
                    }));

                    const jawaban = matchinganswer.map((result) => ({
                        id: result.id,
                        nomor: result.nomor,
                        jawaban: result.jawaban,
                        id_jawaban_benar: result.id_jawaban_benar
                    })).sort(() => Math.random() - 0.5);

                    comparation = [{pernyataan, jawaban}];
                }
                // else if (soal.jenis_soal === 3) {
                //     trueandfalse = await soalRepository.getBenarsalah(soal.kode_mapel, soal.nomor_soal, soal.kelas);
                // }
                else {
                    jawabanEssay = await soalRepository.getJawabanEssayB(soal.kode_mapel,soal.nomor_soal, soal.kelas);
                }

                const pilihan_ganda = soal.jenis_soal === 0 && pilihan != null ? pilihan : null;
                const jawaban_essay = soal.jenis_soal === 1 && jawabanEssay != null ? jawabanEssay : null;
                const menjodohkan = soal.jenis_soal === 2 && comparation != null ? comparation : null;
                const benarsalah = soal.jenis_soal === 3 && trueandfalse != null ? trueandfalse : null;
                
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
                    jawaban_essay,
                    menjodohkan,
                    benarsalah
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
        const {tahun_ajaran, nama_mapel, id_mapel, kelas, nomor_soal, jenis_soal, available_on, skor, text_soal, text_jawaban} = req.body;
        // get mapel, if not in table, insert first
        const mapelInTable = await mapelRepository.getDataMapelForOne(id_mapel);
    
        if (!mapelInTable) {
            // insert parent table (mapel)
            const dataMapel = kelas.map(kelassAssign =>({
                idmapel: id_mapel,
                nama_mapel: nama_mapel,
                kelas: kelassAssign.kelas_assign,
                created_date: new Date,
            }))
            await mapelRepository.insertMapelBulkKelas(dataMapel);

        } else {
            let soalInput;
            console.log('kelas', kelas);
            for (const kelassAssign of kelas){
                console.log('kelas', kelassAssign);
                const existingSoal = await soalRepository.getSoalByKodeAndNomor(id_mapel, nomor_soal, kelassAssign.kelas_assign);
                console.log('existing soal', existingSoal);
                
                if (existingSoal) {
                    console.log('existing')
                    // if soal exist update the soal
                    soalInput = await soalRepository.updateTextSoal(text_soal, id_mapel, nomor_soal, kelassAssign.kelas_assign, skor);
                } else {
                    // insert into child 1 (soal)
                    console.log('baru')
                    soalInput = await soalRepository.insertIntoSoal(nomor_soal, id_mapel, kelassAssign.kelas_assign, text_soal, jenis_soal, available_on, skor);
                }

                //logic save jawaban using pilgan or essay
                if (jenis_soal === 0) {
                    // save jawaban ke table pilihan
                    const jawabanPilihanGanda = text_jawaban.pilihan_ganda.map(jawaban =>({
                        kode_mapel: id_mapel,
                        nomor_soal: nomor_soal,
                        pilihan: jawaban.pilihan,
                        idx_pilihan: jawaban.idx_pilihan,
                        kelas: kelassAssign.kelas_assign,
                        pilihan_benar: jawaban.pilihan_benar,
                        skor: jawaban.skor
                    }))

                    console.log('delete pilihan');
                    // first, delete existing pilihan for the soal if it exist
                    await soalRepository.deletePilihanGanda(id_mapel, nomor_soal, kelassAssign.kelas_assign);

                    await soalRepository.insertIntoPilihanBulk(jawabanPilihanGanda);
                } else if (jenis_soal === 2) {
                    //cek no nya sama atau tidak dengan no mencocokan
                    //jika sama save ke table question_matcher
                    //jika tidak sama ke table question_answer


                    //save for mencocokan
                    console.log('mencocokan');
                    const listMencocokanSave = text_jawaban.mencocokan
                    .filter(payload => payload.no !== nomor_soal)
                    .map(payload => ({
                        nomor_soal: payload.no,
                        jenis_soal: 2,
                        jawaban: payload.jawaban,
                        skor: payload.skor,
                        created_at: new Date(),
                        kelas: kelassAssign.kelas_assign
                    }));

                    if (listMencocokanSave.length > 0) {
                        console.log('insert mencocokan', listMencocokanSave);
                        await soalRepository.insertIntomatchingAnswerBulk(listMencocokanSave);
                    }
                        console.log('insert into matching_question');
                        const jawaban_benar_payload = text_jawaban.mencocokan
                            .filter(payload => payload.no === nomor_soal)
                            .map(payload => ({
                                jawaban: payload.jawaban,
                                skor: payload.skor
                            }));

                            if (jawaban_benar_payload.length > 0) {
                                console.log('jawaban : ', jawaban_benar_payload);
                                console.log('text soal : ', text_soal);
                                await soalRepository.insertMatchingQuestion(id_mapel, nomor_soal, jenis_soal, text_soal, jawaban_benar_payload[0].jawaban, kelassAssign.kelas_assign, jawaban_benar_payload[[0]].skor);
                            }

                }else if (jenis_soal === 3) {
                    //save for true false
                    const existingJawabanBenarSalah = await soalRepository.getJawabanBenarSalah(id_mapel, nomor_soal, jenis_soal, kelassAssign.kelas_assign);
                    console.log('Input soal benar salah');
                    if (existingJawabanBenarSalah) {
                        await soalRepository.updateJawabanBenarSalah(text_jawaban.benarsalah.jawaban, id_mapel, jenis_soal, nomor_soal, kelassAssign.kelas_assign);
                    } else {
                        await soalRepository.insertJawabanBenarSalah(id_mapel, nomor_soal, jenis_soal, text_soal, text_jawaban.benarsalah.jawaban, kelassAssign.kelas_assign, skor);
                    }

                }else {
                    const existingEssayJawaban = await soalRepository.getJawabanEssay(id_mapel, jenis_soal, nomor_soal, kelassAssign.kelas_assign);
                    
                    console.log('data essay jawaban: ', existingEssayJawaban);

                    if (existingEssayJawaban) {
                        await soalRepository.updateJawabanEssay(text_jawaban.essay.jawaban, id_mapel, jenis_soal, nomor_soal, kelassAssign.kelas_assign);
                    } else {
                        console.log('insert jawaban essay: kode soal: ', id_mapel);
                        await soalRepository.insertIntoJawaban(id_mapel, nomor_soal, text_jawaban.essay.jawaban, jenis_soal, kelassAssign.kelas_assign, text_jawaban.essay.skor);
                    }
                }

                const assignStatus = await mapelRepository.getMapelAssignForClass(id_mapel, kelassAssign.kelas_assign);
                //asiggn soal into kelas
                if (!assignStatus) {
                    //initiate data from data_induk first
                    const nisnSiswa = await mapelRepository.getDataInduk(kelassAssign.kelas_assign, tahun_ajaran);
                    const nisnBulk = nisnSiswa.map(nisns => ({
                        kd_mapel: id_mapel,
                        kelas: kelassAssign.kelas_assign,
                        status_available: 1,
                        nisn: nisns.nisn
                    }))
                    console.log('nisn bulk : ', nisnBulk);
                    await mapelRepository.insertAssignSoalBulk(nisnBulk);
                    // await mapelRepository.insertAssignSoal(kode_soal, id_mapel, kelas, 1);
                }
            }
        
            return soalInput;
        }
        
    } catch (error) {
        console.error('Error in service input soal handler', error);
        throw Error(error);
    }
}

async function inputJawabanSiswa(req){
    try {
        const { payload } = req.body;
        const jawabanDataSiswaList = [];
        for (let jawaban of payload) {
            const {
                nama_siswa,
                nisn,
                kelas,
                idmapel,
                nomor_soal,
                jenis_soal,
                text_soal,
                jawaban: { idx_pilihan, text_jawaban, mencocokan, benarsalah },
                skor
            } = jawaban;
        
            if (jenis_soal === 2) {
                // Loop untuk setiap pernyataan dan jawaban yang cocok
                for (let i = 0; i < mencocokan.pernyataan.length; i++) {
                    const pernyataan = mencocokan.pernyataan[i];
                    const jawabanObj = {
                        nama_siswa,
                        nisn,
                        kelas,
                        idmapel,
                        nomor_soal: pernyataan.nomor_soal, // Ambil nomor soal dari pernyataan
                        jenis_soal,
                        text_soal: pernyataan.text_soal, // Ambil teks soal dari pernyataan
                        jawaban: mencocokan.jawaban[i]?.jawaban || "", // Pastikan jawaban ada
                        skor
                    };
        
                    jawabanDataSiswaList.push(jawabanObj);
                }
            } else {
                // Default object untuk non-matching questions
                const jawabanObj = {
                    nama_siswa,
                    nisn,
                    kelas,
                    idmapel,
                    nomor_soal,
                    jenis_soal,
                    text_soal,
                    skor
                };
        
                if (jenis_soal === 0) {
                    const getSkor = await soalRepository.getSkor(idmapel, nomor_soal, kelas, 1);
                    jawabanObj.skor = getSkor.idx_pilihan === idx_pilihan ? getSkor.skor : 0;
                    jawabanObj.jawaban = idx_pilihan;
                } else if (jenis_soal === 1) {
                    jawabanObj.jawaban = text_jawaban;
                } else if (jenis_soal === 3) {
                    jawabanObj.jawaban = benarsalah;
                }
        
                jawabanDataSiswaList.push(jawabanObj);
            }
        
            // Update status soal setelah berhasil disimpan
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
            const { skor, kelas, nisn, idmapel, nomor_soal } = payloads;
            // Lakukan update untuk setiap jawaban siswa
            await soalRepository.updateSkorJawabanSiswa(kelas, nisn, idmapel, nomor_soal, skor);
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

 async function inserSoalMencocokan(req) {
    try {
        const {tahun_ajaran, nama_mapel, id_mapel, kelas, jenis_soal, available_on,nomor_soal, skor, mencocokan } = req.body;
        const mapelInTable = await mapelRepository.getDataMapelForOne(id_mapel);
        let soalInput;

        if (!mapelInTable) {
            // insert parent table (mapel)
            const dataMapel = kelas.map(kelassAssign =>({
                idmapel: id_mapel,
                nama_mapel: nama_mapel,
                kelas: kelassAssign.kelas_assign,
                created_date: new Date,
            }))
            await mapelRepository.insertMapelBulkKelas(dataMapel);
        } else {
            console.log('starting input soal mencocokan kelas : {}', kelas);
            if (jenis_soal === 2) {
                for (const kelassAssign of kelas){
                    
                    const listPernyataan = mencocokan.pernyataan
                    .map(payload => ({
                        kode_mapel: id_mapel,
                        nomor_soal: payload.nomor_soal,
                        jenis_soal: jenis_soal,
                        text_soal: payload.text_soal,
                        id_jawaban_benar: payload.id_jawaban_benar,
                        created_at: new Date(),
                        kelas: kelassAssign.kelas_assign
                    }));

                    if (listPernyataan.length > 0) {
                        console.log('insert into pernyataan');
                        await soalRepository.insertMatchingQuestion(listPernyataan);
                        console.log('finish insert pernyataan');
                    }

                    const listJawabanMencocokan = mencocokan.jawaban
                    .map(payload => ({
                        nomor: payload.nomor,
                        jenis_soal: jenis_soal,
                        jawaban: payload.jawaban,
                        skor: 0,
                        created_at: new Date(),
                        kelas: kelassAssign.kelas_assign,
                        id_jawaban_benar: payload.id_jawaban_benar
                    }))

                    if (listJawabanMencocokan.length > 0) {
                        console.log('insert into jawaban mencocokan', listJawabanMencocokan);
                        await soalRepository.insertIntomatchingAnswerBulk(listJawabanMencocokan);
                    }

                    //insert into table soal
                    if (mencocokan.pernyataan.length > 0) {
                        for (const dataPernyataanMencocokan of mencocokan.pernyataan){
                            const existingSoal = await soalRepository.getSoalByKodeAndNomor(id_mapel, dataPernyataanMencocokan.nomor_soal, kelassAssign.kelas_assign);
                            console.log('existing soal', existingSoal);
                            
                            if (existingSoal) {
                                console.log('existing')
                                // if soal exist update the soal
                                soalInput = await soalRepository.updateTextSoal(dataPernyataanMencocokan.text_soal, id_mapel, dataPernyataanMencocokan.nomor_soal, kelassAssign.kelas_assign, dataPernyataanMencocokan.skor);
                            } else {
                                // insert into child 1 (soal)
                                console.log('baru')
                                soalInput = await soalRepository.insertIntoSoal(dataPernyataanMencocokan.nomor_soal, id_mapel, kelassAssign.kelas_assign, dataPernyataanMencocokan.text_soal, jenis_soal, available_on, dataPernyataanMencocokan.skor);
                            }
            
                        }
                    }
                    const assignStatus = await mapelRepository.getMapelAssignForClass(id_mapel, kelassAssign.kelas_assign);
                    //asiggn soal into kelas
                    if (!assignStatus) {
                        //initiate data from data_induk first
                        const nisnSiswa = await mapelRepository.getDataInduk(kelassAssign.kelas_assign, tahun_ajaran);
                        const nisnBulk = nisnSiswa.map(nisns => ({
                            kd_mapel: id_mapel,
                            kelas: kelassAssign.kelas_assign,
                            status_available: 1,
                            nisn: nisns.nisn
                        }))
                        console.log('nisn bulk : ', nisnBulk);
                        await mapelRepository.insertAssignSoalBulk(nisnBulk);
                        // await mapelRepository.insertAssignSoal(kode_soal, id_mapel, kelas, 1);
                    }
                }
                
            }

            return soalInput;

        }
        
    } catch (error) {
        console.error('Error when inserting soal mencocokan', error);
        throw error;
    }
 }

 async function getPreviewSoal(req) {
    try {
        const {kelas} = req.query;
        const data = await soalRepository.getPreviewSoal(kelas);
        return data;
    } catch (error) {
        console.error('Error get soal preview');
        throw error;
    }
 }

async function getStatusPengerjaan(req) {
    try {
        const {kelas, tahun_ajaran, idmapel} = req.query;
        const data = await soalRepository.getStatusPengerjaan(kelas, tahun_ajaran, idmapel);
        return data;
    } catch (error) {
        console.error('Error get data status');
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
    insertAnalisisJawabanSiswa,
    inserSoalMencocokan,
    getPreviewSoal,
    getStatusPengerjaan
}


const { insertSoalRepository } = require("../repository");

async function insertDataSoal(req) {
    const { datapelajaran, soal, pilihan_ganda, jawaban} = req.body;
    try {
        for (const datapelajarans of datapelajaran) {
            const {mata_pelajaran, kelas, no_soal, soal} = datapelajarans;

            // insert soal
            await insertSoalRepository.insertIntoSoal('', no_soal, '', kelas, soal);
            
        }
    } catch (error) {
        console.error('Error in service mapel');
        throw error;
    }
}
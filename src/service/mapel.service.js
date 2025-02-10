const { mapelRepository } = require("../repository");

async function insertDataMapel(req){
    const {idmapel, nama_mapel, kelas, guru_pengampu, kode_guru} = req.body;
    try {
        let kelass;
        for (const kelasAssign of kelas){
            kelass = kelasAssign.kelas_assign;
            await mapelRepository.insertDataMapel(idmapel, nama_mapel, kelasAssign.kelas_assign, guru_pengampu, kode_guru);
        }
        return {nama_mapel, kelass};
        
    } catch (error) {
        console.error('Error in service mapel');
        throw error;
    }
}

async function getDataMapel(){
    try {
        const responseData = await mapelRepository.getDataMapel();
        return responseData;
    } catch (error) {
        console.error('Error in service mapel');
        throw error;
    }
}

async function getMapelForGuru(req) {
    const {kode_guru, kelas} = req.query;
    try {
        const responseData = await mapelRepository.getMapelForGuru(kode_guru, kelas);
        return responseData;
    } catch (error) {
        console.error('Error in service when get mapel');
        throw error;
    }
}

async function deleteMapel(req) {
    try {
        const {nama_mapel, kelas, guru_pengampu} = req.body;
        let kelasDelete;
        for (const kelass of kelas){
            kelasDelete = kelass.kelas_assign;
            await mapelRepository.deleteMapel(nama_mapel, kelass.kelas_assign, guru_pengampu);
        }
        return kelasDelete;
    } catch (error) {
        console.error('Error delete mapel');
        throw error;
    }
}

async function getMapelForGuruUseKodeGuru(req) {
    const {kode_guru} = req.query;
    try {
        const responseData = await mapelRepository.getMapelForGuruUseKodeGuru(kode_guru);
        return responseData;
    } catch (error) {
        console.error('Error in service when get mapel');
        throw error;
    }
}

module.exports = {
    insertDataMapel,
    getDataMapel,
    getMapelForGuru,
    deleteMapel,
    getMapelForGuruUseKodeGuru
}
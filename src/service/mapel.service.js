const { mapelRepository } = require("../repository");

async function insertDataMapel(req){
    const {idmapel, nama_mapel, kelas, guru_pengampu, kode_guru} = req.body;
    try {
        await mapelRepository.insertDataMapel(idmapel, nama_mapel, kelas, guru_pengampu, kode_guru);
        return {nama_mapel, kelas};
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
    const {kode_guru} = req.query;
    try {
        const responseData = await mapelRepository.getMapelForGuru(kode_guru);
        return responseData;
    } catch (error) {
        console.error('Error in service when get mapel');
        throw error;
    }
}

module.exports = {
    insertDataMapel,
    getDataMapel,
    getMapelForGuru
}
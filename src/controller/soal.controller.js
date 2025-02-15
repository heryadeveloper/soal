const { soalService } = require("../service");
const catchAsync = require("../utils/catchAsync");
const expectationFailed = require("../utils/errorExpectationFailed");
const responseInfo = require("../utils/responseInfo");
const createError = require('http-errors');

const getSoal = catchAsync(async(req, res) => {
    const getSoals = await soalService.getSoal(req);
    if (getSoals) {
        res.send(responseInfo('found soal', getSoals));
    } else {
        res.send(expectationFailed('Not Found Soal', null));
    }
})

const getSoalEssay = catchAsync(async(req, res) => {
    const getSoals = await soalService.getSoalEssay(req);
    if (getSoals) {
        res.send(responseInfo('found soal', getSoals));
    } else {
        res.send(expectationFailed('Not Found Soal', null));
    }
})

const getPilgan = catchAsync(async( req, res) => {
    const pilgan = await soalService.getPilgan(req);
    if (pilgan) {
        res.send(responseInfo('Found pilgand', pilgan));
    } else {
        res.send(expectationFailed('Not Found Pilgand', null));
    }
})

const getEssay = catchAsync(async( req, res) => {
    const essay = await soalService.getEssay(req);
    if (essay) {
        res.send(responseInfo('Found pilgand', essay));
    } else {
        res.send(expectationFailed('Not Found essay', null));
    }
})

const inputSoal = catchAsync(async(req, res, next) => {
    try {
        const inputSoals = await soalService.inputSoalHandler(req);
        if (inputSoals) {
            res.send(responseInfo('Success Insert Soal', inputSoals));
        } else {
            res.send(expectationFailed('Something issue when inserting soal', null));
        }
    } catch (error) {
        res.send(expectationFailed(error.message, null));
    }
   
})

const inputJawabanSiswa = catchAsync(async(req, res) => {
    const inputJawabanSiswas = await soalService.inputJawabanSiswa(req);
    if (inputJawabanSiswas) {
        res.send(responseInfo('Success Insert Jawaban Siswa', inputJawabanSiswas));
    } else {
        res.send(expectationFailed('Something issue when inserting soal', null))
    }
})

const getAvailableTest = catchAsync(async( req, res) => {
    const availableTest = await soalService.getAvailableTest(req);
    console.log('available test', availableTest);
    if (availableTest.length > 0) {
        res.send(responseInfo('Available Test', availableTest));
    } else if (availableTest.length == 0){
        res.send(responseInfo('No available test', null));
    } else {
        res.send(expectationFailed('Something when wrong', null));
    }
})

const deleteSoal = catchAsync(async(req, res) => {
    const resDeleteSoal = await soalService.deleteSoal(req);
    if (resDeleteSoal.nomor_soal != null) {
        res.send(responseInfo('Success Delete Soal', resDeleteSoal));
    } else {
        res.send(expectationFailed('Something when wrong', null));
    }
})

const getDataJawabanSiswa = catchAsync(async(req, res) => {
    const dataJawabanSisa = await soalService.getDataJawabanSiswa(req);
    if (dataJawabanSisa) {
        res.send(responseInfo('Success get data jawaban siswa', dataJawabanSisa));
    } else {
        res.send(expectationFailed('Something when wrong', null));
    }
})

const updateSkorJawabanSiswa = catchAsync(async(req, res) => {
    const statusUpdate = await soalService.updateSkorJawabanSiswa(req);
    if (statusUpdate) {
        res.send(responseInfo('Success Updating Skor Jawaban Siswa', statusUpdate));
    } else {
        res.send(expectationFailed('Something error', null));
    }
})

const sumSkorJawabanSiswa = catchAsync(async(req, res) => {
    const sumSkor = await soalService.sumSkorJawabanSiswa(req);
    if (sumSkor) {
        res.send(responseInfo('Success Calculate Skor', sumSkor));
    } else {
        res.send(expectationFailed('Something error', null));
    }
})

const analisisJawaban = catchAsync(async(req, res) => {
    const analisisJawaban = await soalService.analisisJawabanSiswa(req);
    if (analisisJawaban) {
        res.send(responseInfo('Success Calculate Skor', analisisJawaban));
    } else {
        res.send(expectationFailed('Something error', null));
    }
})

const insertAnalisisJawabanSiswa = catchAsync(async(req, res) => {
    const insertAnalisisJawaban = await soalService.insertAnalisisJawabanSiswa(req);
    if (insertAnalisisJawaban) {
        res.send(responseInfo('Success Insert Analisis Jawaban Siswa', insertAnalisisJawaban));
    } else {
        res.send(expectationFailed('Something Error', null));
    }
})

const insertSoalMencocokan = catchAsync(async(req, res) => {
    const insertSoalMencocokan = await soalService.inserSoalMencocokan(req);
    if (insertSoalMencocokan) {
        res.send(responseInfo('Success Insert Soal Mencocokan', insertSoalMencocokan));
    } else {
        res.send(expectationFailed('Something Error', null));
    }
})

const getSoalPreview = catchAsync(async(req, res) => {
    const previewSoal = await soalService.getPreviewSoal(req);
    if (previewSoal) {
        res.send(responseInfo('Success get preview soal', previewSoal));
    } else {
        res.send(expectationFailed('Something Error', null));
    }
})
module.exports = {
    getSoal,
    getSoalEssay,
    getPilgan,
    getEssay,
    inputSoal,
    inputJawabanSiswa,
    getAvailableTest,
    deleteSoal,
    getDataJawabanSiswa,
    updateSkorJawabanSiswa,
    sumSkorJawabanSiswa,
    analisisJawaban,
    insertAnalisisJawabanSiswa,
    insertSoalMencocokan,
    getSoalPreview
}
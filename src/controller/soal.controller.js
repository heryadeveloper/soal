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
        console.log('input soal log: ', inputSoals);
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
    console.log('controller available: ', availableTest);
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
    console.log('delete log: ', resDeleteSoal);
    if (resDeleteSoal.nomor_soal != null) {
        res.send(responseInfo('Success Delete Soal', resDeleteSoal));
    } else {
        res.send(expectationFailed('Something when wrong', null));
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
    deleteSoal
}
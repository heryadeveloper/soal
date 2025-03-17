const { peniaianService } = require("../service");
const catchAsync = require("../utils/catchAsync");
const expectationFailed = require("../utils/errorExpectationFailed");
const responseInfo = require("../utils/responseInfo");

const getFinalDataPenilaians = catchAsync(async(req, res) => {
    const getFinalData = await peniaianService.getFinalDataPenilaian(req);
    if (getFinalData) {
        res.send(responseInfo('found data', getFinalData));
    } else {
        res.send(expectationFailed('Not Found Data Penilaian', null));
    }
})

const generateExcel =  catchAsync(async(req, res)=> {
    try {
        await peniaianService.generateExcelDaftarNilaiAkhir(req, res);
    } catch (error) {
        res.send(errorExpectationFailed.expectationFailed('Internal Service Error', null))
    }
})


module.exports = {
    getFinalDataPenilaians,
    generateExcel
}
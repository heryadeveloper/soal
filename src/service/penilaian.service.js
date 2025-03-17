const { v4: uuidv4 } = require('uuid');
const { penilaiaRepository } = require("../repository");
const ExcelJs = require('exceljs');

async function getFinalDataPenilaian(req) {
    const{kode_guru, kelas, idmapel} = req.query;

    try {
        const responseData = penilaiaRepository.getFinalPenilaian(kode_guru, kelas, idmapel);
        return responseData;
    } catch (error) {
        console.error('Error in service get final data penilaian');
        throw error;
    }
}

async function generateExcelDaftarNilaiAkhir(req, res) {
    const{kode_guru, kelas, idmapel} = req.query;
    try {
        const responseData = await penilaiaRepository.getFinalPenilaian(kode_guru, kelas, idmapel);
        console.log('response excel : ', responseData);
        const uniqueId = uuidv4();

        const filename = `Generate_Data_Nilai_${uniqueId}.xlsx`;
        const workbook = new ExcelJs.Workbook();
        const worksheet = workbook.addWorksheet('Data Nilai Akhir US');

        worksheet.columns = [
            { header: "No", key: "id", width: 3 },
            { header: "Nama Lengkap", key: "nama_siswa", width: 20 },
            { header: "Nisn", key: "nisn", width: 10 },
            { header: "Nilai", key: "nilai", width: 20 },
            { header: "Submit Data", key: "tanggal_submit", width: 20 },
        ];
        console.log('response excel 2');
        responseData.forEach((item) => {
            const row = worksheet.addRow(item);
            row.eachCell((cell) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFFFF"}
                };

                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error in service generate excel nilai');
        throw error;
    }
    
}

module.exports ={
    getFinalDataPenilaian,
    generateExcelDaftarNilaiAkhir
}
const { mapelRepository } = require("../repository");
const catchAsync = require("../utils/catchAsync");
const errorNotFound = require('../utils/errorExpectationFailed');
const responseInfo = require("../utils/responseInfo");
const upload = require('../middleware/multerConfig');
const expectationFailed = require("../utils/errorExpectationFailed");
const path = require("path");
const fs = require('fs');

const uploadFile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('❌ Upload error:', err);
            return res.status(400).send({ error: 'File upload failed', details: err.message });
        }
        console.log('📦 Body:', req.body);
        console.log('📂 Uploaded File:', req.file);

        if (!req.file) {
            return res.status(400).send({ error: 'No file uploaded' });
        }

        const { nama, kelas, mapel } = req.body;

        if (!kelas || !mapel) {
            return res.status(400).send({ error: 'Kelas dan mapel harus diisi' });
        }

        const now = new Date();
        const tanggal = `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}${now.getFullYear()}`;


        // 📂 Tentukan folder tujuan
        const uploadPath = path.join(__dirname, '../../upload', kelas, mapel, tanggal);

        // 🛠️ Buat folder jika belum ada
        fs.mkdirSync(uploadPath, { recursive: true });

        // 📦 Pindahkan file dari `temp/` ke folder tujuan
        const oldPath = req.file.path;
        const newPath = path.join(uploadPath, req.file.filename);
        const fileName = req.file.filename;
        const filePath = `../../upload/${kelas}/${mapel}/${tanggal}/${fileName}`;

        // fs.rename(oldPath, newPath, async (err) => {
        //     if (err) {
        //         console.error('❌ Gagal memindahkan file:', err);
        //         return res.status(500).send({ error: 'Failed to move file' });
        //     }

        //     console.log('✅ File berhasil dipindahkan ke:', newPath);
        //     res.send({ message: 'File uploaded successfully', file: newPath });
        // });

        // try {
        //     const result = await mapelRepository.uploadGamber(nama, fileName, filePath, kelas, mapel);
        //     console.log('result : ', result);
        //     res.send(responseInfo('File upload successful', result));
        // } catch (error) {
        //     console.error('Error during file upload:', error);
        //     // Hapus file yang sudah diupload jika terjadi error
        //     if (fs.existsSync(filePath)) {
        //         fs.unlinkSync(filePath);
        //     }
        //     res.status(417).send(errorNotFound('Something went wrong', error));
        // }
        fs.rename(oldPath, newPath, async (err) => {
            if (err) {
                console.error('❌ Gagal memindahkan file:', err);
                return res.status(500).send({ error: 'Failed to move file' });
            }
        
            console.log('✅ File berhasil dipindahkan ke:', newPath);
        
            try {
                const result = await mapelRepository.uploadGamber(nama, fileName, filePath, kelas, mapel);
                console.log('result : ', result);
                res.send(responseInfo('File upload successful', result)); // ✅ Hanya satu res.send()
            } catch (error) {
                console.error('Error during file upload:', error);
                
                // Hapus file yang sudah diupload jika terjadi error
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
        
                res.status(417).send(errorNotFound('Something went wrong', error));
            }
        });
        
    });
};


// const uploadFile = catchAsync(async (req, res) => {
//     console.log('Request Body:', req.body); // Debugging
//     console.log('Request File:', req.file); // Debugging

//     const { nama, kelas, mapel } = req.body;
//     const fileName = req.file.filename;
//     const filepath = path.join(__dirname, '../../upload', kelas, mapel, fileName);

//     console.log('Upload file:', nama, kelas, mapel);
//     console.log('File saved at:', filepath);

//     try {
//         const result = await mapelRepository.uploadGamber(nama, fileName, filepath, kelas, mapel);
//         res.send(responseInfo('File upload successful', result));
//     } catch (error) {
//         console.error('Error during file upload:', error);

//         // Hapus file yang sudah diupload jika terjadi error
//         if (fs.existsSync(filepath)) {
//             fs.unlinkSync(filepath);
//         }

//         res.status(417).send(errorNotFound('Something went wrong', error));
//     }
// });

const getImage = catchAsync(async(req, res) => {
    const {nama} = req.query;
    try {
        console.log('get image');
        const imageData = await mapelRepository.getImage(nama);
        res.send(responseInfo('Found path image guru', imageData));
    } catch (error) {
        res.send(expectationFailed('Something error', null));
    }
})

module.exports = {
    uploadFile,
    getImage
}
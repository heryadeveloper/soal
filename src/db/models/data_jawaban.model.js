module.exports = (sequelize, DataType) => {
    const dataJawaban = sequelize.define(
        'data_jawaban_siswa',
        {
            id:{
                type:DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nama_siswa:{
                type:DataType.STRING,
                allowNull:false,
            },
            kelas:{
                type:DataType.STRING,
                allowNull: false,
            },
            nisn:{
                type:DataType.STRING,
                allowNull:false,
            },
            idmapel:{
                type:DataType.INTEGER,
                allowNull: false
            },
            kode_soal: {
                type:DataType.INTEGER,
                allowNull: false,
            },
            nomor_soal:{
                type:DataType.INTEGER,
                allowNull: false,
            },
            jenis_soal:{
                type:DataType.INTEGER,
                allowNull: false,
            },
            text_soal:{
                type: DataType.STRING,
                allowNull:false,
            },
            jawaban:{
                type: DataType.STRING,
                allowNull: false,
            },
            skor:{
                type:DataType.INTEGER,
                allowNull: false,
            }
        },{
            tableName:'data_jawaban_siswa'
        }
    );
    return dataJawaban;
}
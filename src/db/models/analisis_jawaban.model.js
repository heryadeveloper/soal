module.exports = (sequelize, DataType) => {
    const analisisJawaban = sequelize.define(
        'analisis_jawaban',
        {
            id:{
                type:DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            kelas:{
                type:DataType.STRING,
                allowNull: false,
            },
            kode_soal:{
                type:DataType.INTEGER,
                allowNull:false,
            },
            nomor_soal:{
                type:DataType.INTEGER,
                allowNull: false
            },
            jenis_soal: {
                type:DataType.STRING,
                allowNull: false,
            },
            kategori_soal:{
                type:DataType.STRING,
                allowNull: false
            }
        },{
            tableName:'analisis_jawaban'
        }
    );
    return analisisJawaban;
}
module.exports = (sequelize, DataType)=> {
    const essay = sequelize.define(
        'essay',
        {
            id:{
                type:DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            kode_mapel:{
                type:DataType.INTEGER,
                allowNull:false,
            },
            nomor_soal:{
                type:DataType.INTEGER,
                allowNull: false,
            },
            jenis_soal:{
                type: DataType.INTEGER,
                allowNull: false
            },
            jawaban:{
                type:DataType.STRING,
                allowNull:false,
            },
            created_at:{
                type:DataType.DATE,
                defaultValue: DataType.NOW,
                allowNull: false
            },
            kelas: {
                type:DataType.STRING,
                allowNull: false,
            },
            skor:{
                type:DataType.INTEGER,
                allowNull: true,
            }
        },{
            tableName:'essay'
        }
    );

    return essay;
}

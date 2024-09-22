module.exports = (sequelize, DataType)=> {
    const essay = sequelize.define(
        'essay',
        {
            id:{
                type:DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            kode_soal:{
                type:DataType.INTEGER,
                allowNull:false,
            },
            nomor_soal:{
                type:DataType.INTEGER,
                allowNull: false,
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
                allowNull: false,
            }
        },{
            tableName:'essay'
        }
    );

    return essay;
}

module.exports = (sequelize, DataType)=> {
    const pilihan_ganda = sequelize.define(
        'pilihan_ganda',
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
            pilihan:{
                type:DataType.STRING,
                allowNull:false,
            },
            created_at:{
                type:DataType.DATE,
                defaultValue: DataType.NOW,
                allowNull: false
            },
            idx_pilihan:{
                type: DataType.STRING,
                allowNull: false,
            },
            kelas: {
                type: DataType.STRING,
                allowNull: false,
            },
            pilihan_benar: {
                type: DataType.BOOLEAN,
                allowNull: false
            },
            skor: {
                type: DataType.INTEGER,
                allowNull: true,
            }
        },{
            tableName:'pilihan_ganda'
        }
    );

    return pilihan_ganda;
}

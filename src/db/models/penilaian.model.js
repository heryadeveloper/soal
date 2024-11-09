module.exports = (sequelize, DataType) => {
    const penilaian = sequelize.define(
        'penilaian',
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
            mata_pelajaran:{
                type:DataType.STRING,
                allowNull: false
            },
            nilai: {
                type:DataType.INTEGER,
                allowNull: false,
            },
            submit_date:{
                type:DataType.DATE,
                defaultValue: DataType.NOW,
                allowNull: false
            }
        },{
            tableName:'penilaian'
        }
    );
    return penilaian;
}
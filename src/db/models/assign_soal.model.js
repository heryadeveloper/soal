module.exports = (sequelize, DataType) => {
    const assignSoal = sequelize.define(
        'assign_soal',
        {
            id:{
                type:DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            kd_mapel:{
                type:DataType.INTEGER,
                allowNull: false
            },
            kelas: {
                type:DataType.STRING,
                allowNull: false,
            },
            status_available:{
                type:DataType.STRING,
                allowNull: false
            },
            created_date:{
                type:DataType.DATE,
                defaultValue: DataType.NOW,
                allowNull: false
            },
            nisn:{
                type:DataType.STRING,
                allowNull: false
            }
        },{
            tableName:'assign_soal'
        }
    );
    return assignSoal;
}
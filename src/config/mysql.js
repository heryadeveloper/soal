const mysql = require('mysql2/promise'); // Use mysql2 for promise-based API
const config = require('./config');
const logger = require('./logger');

let connection;

(async function initializeConnection() {
    try {
        connection = await mysql.createConnection({
            host: config.sqlDB.host,
            user: config.sqlDB.user,
            password: config.sqlDB.password,
            database: config.sqlDB.database,
            port: config.sqlDB.port,
        });
        logger.info('Connected to MySQL successfully');
    } catch (error) {
        logger.error('Error connecting to MySQL:', error);
        process.exit(1);
    }
})();

module.exports = {
    mysql: connection,
};













// // src/config/mysql.js

// const mysql = require('mysql2/promise');
// const { Client } = require('ssh2');
// const net = require('net');
// const logger = require('./logger');

// const sshConfig = {
//   host: process.env.SSH_HOST,
//   port: process.env.SSH_PORT ? parseInt(process.env.SSH_PORT) : 22,
//   username: process.env.SSH_USERNAME,
//   password: process.env.SSH_PASSWORD,
//   // Optional: Add privateKey if needed
//   // privateKey: fs.readFileSync('/path/to/private/key')
// };

// const dbServer = {
//   host: process.env.SSH_HOST,
//   port: process.env.SSH_PORT ? parseInt(process.env.SSH_PORT) : 3306,
// };

// const forwardConfig = {
//   srcHost: '127.0.0.1',
//   srcPort: 3306,
//   dstHost: dbServer.host,
//   dstPort: dbServer.port,
// };

// const dbConfig = {
//   host: forwardConfig.srcHost,
//   port: forwardConfig.srcPort,
//   user: process.env.SQL_USERNAME,
//   password: process.env.SQL_PASSWORD,
//   database: process.env.SQL_DATABASE_NAME,
// };

// function connectSSH() {
//   return new Promise((resolve, reject) => {
//     const sshClient = new Client();
//     sshClient
//       .on('ready', () => {
//         sshClient.forwardOut(
//           forwardConfig.srcHost,
//           forwardConfig.srcPort,
//           forwardConfig.dstHost,
//           forwardConfig.dstPort,
//           (err, stream) => {
//             if (err) {
//               sshClient.end();
//               return reject(err);
//             }
//             resolve({ sshClient, stream });
//           }
//         );
//       })
//       .on('error', (err) => {
//         reject(err);
//       })
//       .connect(sshConfig);
//   });
// }

// async function connectToDatabase() {
//   try {
//     const { sshClient, stream } = await connectSSH();
//     logger.info('SSH connection established');

//     const connection = await mysql.createConnection({
//       ...dbConfig,
//       stream,
//     });
//     logger.info('Connected to MySQL database');

//     // Test query
//     const [rows] = await connection.execute('SELECT NOW() AS currentTime');
//     logger.info('Database current time:', rows[0].currentTime);

//     // Handle connection close
//     connection.on('end', () => {
//       sshClient.end();
//       logger.info('Database and SSH connections closed');
//     });

//     return connection;
//   } catch (error) {
//     logger.error('Connection error:', error);
//     process.exit(1);
//   }
// }

// module.exports = connectToDatabase();




// // // const {Client} = require('pg');
// // const mysql = require('mysql2/promise');
// // const config = require('./config');
// // const logger = require('./logger');
// // const tunnel = require('tunnel-ssh');

// // // (async function name(){
// // //     // // client = new Client(config.sqlDB);
// // //     // client = new Client({
// // //     //     user: process.env.SQL_USERNAME,
// // //     //     host: process.env.SQL_HOST,
// // //     //     database: process.env.SQL_DATABASE_NAME,
// // //     //     password: process.env.SQL_PASSWORD,
// // //     //     port: process.env.SQL_PORT || 5432,
// // //     // })
// // //     connection = await mysql.createConnection({
// // //         user: process.env.SQL_USERNAME,
// // //         host: process.env.SQL_HOST,
// // //         database: process.env.SQL_DATABASE_NAME,
// // //         password: process.env.SQL_PASSWORD,
// // //         port: process.env.SQL_PORT || 3306, // Default MySQL port is 3306
// // //     });
// // //     try{
// // //         // await client.connect();
// // //         await connection.connect();
// // //         logger.info('Connect to mysql successfully');
// // //         return connection;
// // //     }catch (error){
// // //         logger.error('Connect to mysql Error');
// // //         process.exit(1);
// // //     }
// // // })();

// // const sshConfig = {
// //     username: process.env.SSH_USERNAME,
// //     password: process.env.SSH_PASSWORD, // Use SSH password instead of private key
// //     host: process.env.SSH_HOST,
// //     port: process.env.SSH_PORT || 22, // Default SSH port is 22
// //     dstHost: process.env.SQL_HOST,
// //     dstPort: process.env.SQL_PORT || 3306,
// //     localHost: '127.0.0.1',
// //     localPort: 3306,
// // };

// // const dbConfig = {
// //     user: process.env.SQL_USERNAME,
// //     host: '127.0.0.1', // This is localhost because we're using SSH tunneling
// //     database: process.env.SQL_DATABASE_NAME,
// //     password: process.env.SQL_PASSWORD,
// //     port: 3306,
// // };

// // let connection;

// // tunnel(sshConfig, async (error, server) => {
// //     if (error) {
// //         logger.error('SSH connection error:', error);
// //         return;
// //     }

// //     try {
// //         connection = await mysql.createConnection(dbConfig);
// //         logger.info('Connected to MySQL successfully via SSH tunnel');
// //     } catch (dbError) {
// //         logger.error('MySQL connection error:', dbError);
// //         server.close();
// //         process.exit(1);
// //     }
// // });

// // module.exports = {
// //     mysql: connection,
// // }




// // const mysql = require('mysql2/promise');
// // const config = require('./config');
// // const logger = require('./logger');
// // const tunnel = require('tunnel-ssh');

// // const sshConfig = {
// //     username: process.env.SSH_USERNAME,
// //     password: process.env.SSH_PASSWORD,
// //     host: process.env.SSH_HOST,
// //     port: process.env.SSH_PORT || 64000, // Default SSH port is 22
// //     dstHost: process.env.SQL_HOST,
// //     dstPort: process.env.SQL_PORT || 3306,
// //     localHost: '127.0.0.1',
// //     localPort: 3306,
// //     keepAlive: true,
// // };

// // const dbConfig = {
// //     user: process.env.SQL_USERNAME,
// //     host: '127.0.0.1', // This is localhost because we're using SSH tunneling
// //     database: process.env.SQL_DATABASE_NAME,
// //     password: process.env.SQL_PASSWORD,
// //     port: 3306,
// // };

// // let connection;

// // function createTunnel(config) {
// //     return new Promise((resolve, reject) => {
// //         console.log(typeof tunnel);
// //         tunnel(config, (error, server) => {
// //             if (error) {
// //                 return reject(error);
// //             }
// //             resolve(server);
// //         });
// //     });
// // }

// // function createTunnel(config) {
// //     return new Promise((resolve, reject) => {
// //         tunnel({
// //             username: config.username,
// //             password: config.password,
// //             host: config.host,
// //             port: config.port,
// //             dstHost: config.dstHost,
// //             dstPort: config.dstPort,
// //             localHost: config.localHost,
// //             localPort: config.localPort,
// //             keepAlive: true,  // Keeps the tunnel open
// //         }, (error, server) => {
// //             if (error) {
// //                 return reject(error);
// //             }
// //             resolve(server);
// //         });
// //     });
// // }

// // (async () => {
// //     try {
// //         await createTunnel(sshConfig);
// //         logger.info('SSH tunnel established successfully');

// //         connection = await mysql.createConnection(dbConfig);
// //         logger.info('Connected to MySQL successfully via SSH tunnel');

// //         // Example query to test the connection
// //         const [rows, fields] = await connection.execute('SELECT NOW() AS currentTime');
// //         console.log('Current Time:', rows[0].currentTime);

// //     } catch (error) {
// //         logger.error('Error during SSH or MySQL connection:', error);
// //         process.exit(1);
// //     }
// // })();

// // module.exports = {
// //     mysql: connection,
// // };
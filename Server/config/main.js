module.exports = {
    // Secret key for JWT signing and encryption
    'secret': 'some super secret passphrase',
    // Database connection information
    'database': 'mongodb://admini:m3moriz3d@ds155292.mlab.com:55292/users',
    // Setting port for server
    'port': process.env.PORT || 3000,
    'S3': {
        secretAccessKey: '+xipJ905/hGHhM3Fod09vsNLfegd8DGN2jxoIuT4',
        accessKeyId: 'AKIAJB7APCNF4JK2BH3A',
    }
}
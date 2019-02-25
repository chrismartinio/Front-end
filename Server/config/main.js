module.exports = {
    // Secret key for JWT signing and encryption
    'secret': 'some super secret passphrase',
    // Database connection information
    'database': 'mongodb://admini:m3moriz3d@ds155292.mlab.com:55292/users',
    // Setting port for server
    'port': process.env.PORT || 3000,
    'S3': {
        secretAccessKey: 'cqqeuzocLZ6olPYtiDDwThUXEkBM0vcY61iCkJRb',
        accessKeyId: 'AKIAJI4DJ2J5JOBNU36Q',
        region: 'us-west-1'
    }
}
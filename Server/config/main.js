module.exports = {
    // Secret key for JWT signing and encryption
    'secret': 'some super secret passphrase',
    // Database connection information
    'database': 'mongodb://admini:m3moriz3d@ds155292.mlab.com:55292/users',
    // Setting port for server
    'port': process.env.PORT || 3000
}
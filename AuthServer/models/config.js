const mongoose = require('mongoose'),
    Schema = mongoose.Schema

    const configSchema = new Schema({
        Tokens: Schema.Types.Mixed,
        Config: Schema.Types.Mixed,
        jwtConfig: Schema.Types.Mixed,
        serviceAccounts: Schema.Types.Mixed
    })

var Config = mongoose.model('config', configSchema, 'config');
module.exports = Config;


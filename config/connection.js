const development = {
    database: 'MLM_tyslin',
    username: 'master',
    password: 'tokenoffersmaster',
    host: 'tokenoffers.c5e5q9h5gf1i.us-east-2.rds.amazonaws.com',
    dialect: 'mysql',
   
};

const testing = {
    database: 'MLM_tyslin',
    username: 'master',
    password: 'tokenoffersmaster',
    host: 'tokenoffers.c5e5q9h5gf1i.us-east-2.rds.amazonaws.com',
    dialect: 'mysql',
};

const production = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
};

module.exports = {
    development,
    testing,
    production,
};
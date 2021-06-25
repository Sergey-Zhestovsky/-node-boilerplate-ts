require('../utils/setup-environment')('.env.test');

const inc = process.env.JEST_WORKER_ID;
process.env.DB_URL += inc;
process.env.DB_NAME += inc;

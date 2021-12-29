import envLoader from 'core/loaders/environment.loader';

envLoader('.env.test');

const inc = process.env.JEST_WORKER_ID as string;
process.env.DB_URL = `${process.env.DB_URL as string}${inc}`;
process.env.DB_NAME = `${process.env.DB_NAME as string}${inc}`;

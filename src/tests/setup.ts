import setupEnvironment from '../utils/setup-environment';

setupEnvironment('.env.test');

const inc = process.env.JEST_WORKER_ID as string;
process.env.DB_URL = `${process.env.DB_URL as string}${inc}`;
process.env.DB_NAME = `${process.env.DB_NAME as string}${inc}`;

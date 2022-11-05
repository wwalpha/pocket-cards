import express from 'express';
import morgan from 'morgan';
import { json, urlencoded } from 'body-parser';
import { login, common, healthCheck, refreshToken } from './app';

// Instantiate application
const app = express();

// Configure middleware
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(morgan('combined'));

// health check
app.get('/v1/auth/health', async (req, res) => await common(req, res, healthCheck));

// process login request
app.post('/v1/auth/login', async (req, res) => await common(req, res, login));

// refresh tokens
app.post('/v1/auth/refresh', async (req, res) => await common(req, res, refreshToken));

export default app;

import express from 'express';
import { json, urlencoded } from 'body-parser';
import { createUser, healthCheck, createAdminUser, lookupUser, listAdminUsers } from './app';
import { common } from './utils';

// instantiate application
const app = express();

// configure middleware
app.use(json());
app.use(urlencoded({ extended: false }));

// health check
app.get('/v1/users/health', async (req, res) => await common(req, res, healthCheck));

// create a admin user
app.post('/v1/users/admins', async (req, res) => await common(req, res, createAdminUser));

// list all admin users
app.get('/v1/users/admins', async (req, res) => await common(req, res, listAdminUsers));

// Lookup user pool for any user - no user data returned
app.get('/v1/users/pool/:id', async (req, res) => await common(req, res, lookupUser));

// create a normal user
app.post('/v1/users', async (req, res) => await common(req, res, createUser));

export default app;

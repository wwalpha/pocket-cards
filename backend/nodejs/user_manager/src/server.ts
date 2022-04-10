import express from 'express';
import morgan from 'morgan';
import { json, urlencoded } from 'body-parser';
import {
  CreateStudent,
  CreateUser,
  CreateAdminUser,
  ListAdminUsers,
  ListStudents,
  LookupUser,
  HealthCheck,
  DescribeUser,
} from '@api';
import { common } from './utils';

// instantiate application
const app = express();

// configure middleware
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(morgan('combined'));

// health check
app.get('/v1/users/health', async (req, res) => await common(req, res, HealthCheck));

// create a admin user
app.post('/v1/users/admins', async (req, res) => await common(req, res, CreateAdminUser));

// list all admin users
app.get('/v1/users/admins', async (req, res) => await common(req, res, ListAdminUsers));

// Lookup user pool for any user - no user data returned
app.get('/v1/users/pool/:id', async (req, res) => await common(req, res, LookupUser));

// create a normal user
app.post('/v1/users', async (req, res) => await common(req, res, CreateUser));

// create student user
app.post('/v1/users/students', async (req, res) => await common(req, res, CreateStudent));

// get student list
app.get('/v1/users/students', async (req, res) => await common(req, res, ListStudents));

// describe user infomations
app.get('/v1/users/:userId', async (req, res) => await common(req, res, DescribeUser));

// app._router.stack.forEach((r: any) => {
//   if (r.route && r.route.path) {
//     console.log(r.route.path);
//   }
// });

export default app;

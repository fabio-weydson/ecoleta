import express from 'express';
import path from 'path';

import multer from 'multer';
import multerConfig from '../config/multer';

import PointsController from './controllers/pointsController';
import ItemsController from './controllers/itemsController';

const pointsController = new PointsController();
const itemsController =  new ItemsController();

const upload = multer(multerConfig);

const routes = express.Router();

routes.get('/', (req,res) => { res.json({mensagem:"Servidor rodando"}) })
routes.use('/uploads',express.static(path.resolve(__dirname, '..', 'uploads')))

// METODOS PADRAO
// index, show, create, update, delete/destroy
routes.get('/items', itemsController.index)

routes.get('/points', pointsController.index)
routes.post('/points', upload.single('image') ,pointsController.create)
routes.get('/points/:id', pointsController.show)


export default routes;

// DESIGN PATTERNS
// Service Pattern
// Repository Pattern

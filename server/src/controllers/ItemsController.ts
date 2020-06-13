import {Request, Response} from 'express';
import knex from '../database/connection';

class ItemsController {
 async index (req,res) {
    const items = await knex('items').select('*')
    const serializedItems = items.map(item => {
        return {
            id:item.id,
            title: item.title,
            image_url: `http://ecoleta-srv.herokuapp.com/public/uploads/${item.image}`,
        }
    });
    return res.json(serializedItems);
}
}
export default ItemsController;
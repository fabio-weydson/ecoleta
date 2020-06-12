import {Request, Response} from 'express';
import knex from '../database/connection';

class PointController {
    async index (req: Request,res:Response) {
        const { city, uf, items } = req.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()))
        const allItems = await knex('items').select('id');

        const itemsForSearch = parsedItems.toString()!='NaN'?parsedItems:allItems.map(item => Number(item.id));
        
        const points = await knex('points')
        .join('point_items', 'points.id','=','point_items.point_id')
        .whereIn('point_items.item_id', itemsForSearch)
        .where('points.city', String(city))
        .where('points.uf', String(uf))
        .distinct()
        .select('points.*')

        res.json(points)
    }
    
    async show (req: Request,res:Response) {
        const { id } = req.params;
        const point = await knex('points').where('id', id).first();
        
        if(!point) 
            res.status(400).json({ message:"Point not found" })

        const items = await knex('items')
        .join('point_items', 'point_items.item_id','=','items.id')
        .where('point_items.point_id', id)
        .select('items.title')

        res.json({point, items});
        

    }

    async create (req: Request,res:Response) {
        const trx = await knex.transaction();
    
        const { name,email, whatsapp, latitude, longitude, items, address, number, city, uf} = req.body;
        const point = { image: 'mercado-demo.jpeg',
        name, email, whatsapp, latitude, longitude, address, number, city, uf};
        const insertedIds = await trx('points').insert(point)
        
        const point_id = insertedIds[0];
    
        const pointItems = items.map((item_id:number)=>{
            return { 
                item_id,
                point_id
            }
        })
    
        await trx('point_items').insert(pointItems)
        await trx.commit();

        return res.json({
            id:point_id,
            ...point});
    }
}



export default PointController;
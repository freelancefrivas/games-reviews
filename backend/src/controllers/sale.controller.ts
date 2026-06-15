import {Router} from 'express';
import {Sale} from '../entities/Sale.ts';
import {User} from '../entities/User.ts';

import {raw} from '@mikro-orm/core';
import {Post} from "../entities/Post.ts";

const router = Router();


export const SaleController = (DI: any) => {
    router.get('/', async (req, res) => {
        const {keyword} = req.query;

        const params = {
            ...(keyword && {title: {$like: `%${keyword}%`}}),
        };
        const sales = await DI.em.find(Sale, params, {populate: ['saleGames']});
        res.json(sales);
    });

    router.delete('/:id', async (req, res) => {
        const em = DI.em.fork();
        const sale = await DI.em.findOne(Sale, Number(req.params.id));
        if (!sale)
            return res.sendStatus(404);

        await DI.em.remove(sale).flush();
        res.sendStatus(204);
    });
    return router;
}
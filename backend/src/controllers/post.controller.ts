import {Router} from 'express';
import {Post, PostType} from '../entities/Post.ts';
import {User} from '../entities/User.ts';
import {Review} from "../entities/Review.js";
import {PostMonthlyClicks} from "../entities/PostMonthlyClicks.ts";
import { raw } from '@mikro-orm/core';

const router = Router();


export const PostController = (DI: any) => {

    router.get('/', async (req, res) => {
        const posts = await DI.em.find(Post, {});
        res.json(posts);
    });

    router.post('/', async (req, res) => {
        const post = new Post();
        post.title = req.body.title;
        post.body = req.body.body;
        post.author = DI.em.getReference(User, req.body.author);

        await DI.em.persist(post).flush();
        res.json(post);
    });

    router.delete('/:id', async (req, res) => {
        const em = DI.em.fork();
        const post = await DI.em.findOne(Post, Number(req.params.id));
        if (!post) return res.sendStatus(404);

        await DI.em.remove(post).flush();
        res.sendStatus(204);
    });

    router.get('/news', async (req, res) => {
        const maxParam = req.query.max as string | undefined;
        //   const typeParam = req.query.type as string | undefined;
        let options: any = {orderBy: {id: 'DESC'}};
        // let restrictions: any = {};
        if (maxParam !== undefined) {
            const parsed = Number(maxParam);
            if (!Number.isInteger(parsed) || parsed <= 0) return res.status(400).json({error: 'Invalid max'});
            options = {limit: Math.min(parsed, 10)};
        }
        /*  if (typeParam !== undefined) {
              const types = Array.isArray(typeParam) ? typeParam : [typeParam];

              const invalidTypes = types.filter(t => !Object.values(PostType).includes(t as PostType)); //validate types
              if (invalidTypes.length > 0) {
                  return res.status(400).json({
                      error: 'Invalid type(s)',
                      invalid: invalidTypes
                  });
              }

              restrictions.type = types.length === 1 ? types[0] : { $in: types }; //one or multiple types

          }*/

        const posts = await DI.em.find(Post, {type: ['News', 'Opinion']}, options);
        res.json(posts);

    });

    router.get('/reviews', async (req, res) => {
        const maxParam = req.query.max as string | undefined;
        let options: any = {populate: 'post', orderBy: {id: 'DESC'}};
        if (maxParam !== undefined) {
            const parsed = Number(maxParam);
            if (!Number.isInteger(parsed) || parsed <= 0) return res.status(400).json({error: 'Invalid max'});
            options = {limit: Math.min(parsed, 10)};
        }

        const reviews = await DI.em.find(Review, {}, options);
        res.json(reviews);

    });

    router.get('/most-viewed-month', async (req, res) => {
        const now = new Date();
        const yearMonth:string = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}`
        const stats = await DI.em.find(PostMonthlyClicks, {year_month: yearMonth}, {
            limit: 4,
            orderBy: {clicks: 'DESC'},
            populate: ['post'],
        });
        res.json(stats);
    });

    router.get('/most-viewed-year', async (req, res) => {
        const now = new Date();
        const yearMonths: string[] = [];
        for (let i = 0; i < 12; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            yearMonths.push(`${d.getFullYear()}_${String(d.getMonth() + 1).padStart(2, '0')}`);
        }

        const stats = await DI.em.createQueryBuilder(PostMonthlyClicks,'pmc')
            .select(['post_id','p.title',  raw('SUM(clicks) as total_clicks')])
            .join('post','p')
            .where({ year_month: { $in: yearMonths } })
            .groupBy(['pmc.post_id','p.title'])
            .orderBy({ [raw('total_clicks')]: 'DESC' })
            .limit(4)
            .execute();
        res.json(stats);
    });

    return router;

}


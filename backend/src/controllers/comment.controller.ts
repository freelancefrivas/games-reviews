import {Router} from 'express';
import {Post, PostType} from '../entities/Post.ts';
import {User} from '../entities/User.ts';
import {Sale} from "../entities/Sale.ts";
import {Comment} from "../entities/Comment.ts";


const router = Router();


export const CommentController = (DI: any) => {
    router.get('/', async (req, res) => {
        const {keyword} = req.query;

        const params = keyword ? {
            $or: [
                { body: { $ilike: `%${keyword}%` } },
                { author: { name: { $ilike: `%${keyword}%` } } },
                { post: { title: { $ilike: `%${keyword}%` } } },
            ],
        } : {};
        const comments = await DI.em.find(Comment, params, {populate: ['author', 'post']});
        res.json(comments);
    });

    router.delete('/:id', async (req, res) => {
        const comment = await DI.em.findOne(Comment, Number(req.params.id));
        if (!comment)
            return res.sendStatus(404);

        await DI.em.remove(comment).flush();
        res.sendStatus(204);
    });


    return router;
}
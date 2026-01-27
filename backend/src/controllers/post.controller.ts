import {Router} from 'express';
import {Post, PostType} from '../entities/Post.ts';
import {User} from '../entities/User.ts';
import {Review} from "../entities/Review.js";

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

    return router;

}


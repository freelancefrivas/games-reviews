import { Router } from 'express';
const router = Router();
import {Tag} from "../entities/Tag.ts";


export const TagController = (DI: any) => {
    router.get('/', async (req, res) => {
        const tags = await DI.em.find(Tag, {});
        res.json(tags);
    });

    return router;
}
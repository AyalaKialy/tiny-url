import { Request, Response } from 'express';
import shortUrl from '../models/shortUrl.model.js';
import validUrl from 'valid-url';

export async function createShortUrl(req: Request, res: Response) {
    const { longUrl } = req.body;
    if (!validUrl.isUri(longUrl)) {
        return res.status(401).json('Invalid URL')
    }
    const newUrl = await (shortUrl.create({ longUrl }));
    return res.send(newUrl);
}

export async function handleRedirect(req: Request, res: Response) {
    const { tinyUrl } = req.params;
    const short = await shortUrl.findOne({ tinyUrl });
    if (!short)
        return res.sendStatus(404);
    else
        short.numberOfVisits++;
    short.save();
    return res.redirect(short.longUrl);
}

export async function getNumberOfVisits(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const short = await shortUrl.findOne({ _id: id });
        return res.send(String(short?.numberOfVisits));
    } catch (err) {
        return res.sendStatus(404);
    }
}

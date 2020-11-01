import { TYPES } from '@app/types';
import { DBData } from '@common/communication/drawing-data';
import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import * as multer from 'multer';
import { ID_NAME, NAME, TAGS_NAME } from '../../../common/communication/drawing-data';
import { DatabaseService } from '../services/database.service';

@injectable()
export class DatabaseController {
    router: Router;

    upload: multer.Multer = multer();
    DIR: string = './images';

    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.configureRouter();
        this.databaseService.start();

        if (!fs.existsSync(this.DIR)) {
            fs.mkdirSync(this.DIR);
        }
    }

    private configureRouter(): void {
        this.router = Router();
        const upload = multer({ dest: this.DIR });

        this.router.post('/addDrawing', upload.single('image'), (req: Request, res: Response, next: NextFunction) => {
            const savedFileName = req.file.filename;
            let drawingTags: string[];
            if (req.body[TAGS_NAME] === undefined) drawingTags = [''];
            else drawingTags = req.body[TAGS_NAME];
            const DBDATA: DBData = {
                id: req.body[ID_NAME],
                name: req.body[NAME],
                tags: drawingTags,
                fileName: savedFileName,
            };
            this.databaseService
                .addDrawing(DBDATA)
                .then(() => {
                    res.sendStatus(Httpstatus.StatusCodes.OK);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/deleteDrawing/:fileName', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .deleteDrawing(req.params.fileName)
                .then(() => {
                    res.sendStatus(Httpstatus.StatusCodes.OK);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/getDBData', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getDBData()
                .then((dbData: DBData[]) => {
                    res.send(dbData);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }
}

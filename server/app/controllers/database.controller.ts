import { TYPES } from '@app/types';
import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import * as multer from 'multer';
import { DrawingData } from '../../../common/communication/drawing-data';
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
            this.databaseService
                .addDrawing(req.body, savedFileName)
                .then(() => {
                    res.sendStatus(Httpstatus.StatusCodes.OK);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/deleteDrawing/:id', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .deleteDrawing(req.params.id)
                .then(() => {
                    res.sendStatus(Httpstatus.StatusCodes.OK);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/getDrawingData', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getDrawingData()
                .then((drawings: DrawingData[]) => {
                    res.json(drawings);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }
}

import { TYPES } from '@app/types';
import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { DrawingData } from '../../../common/communication/drawing-data';
import { DatabaseService } from '../services/database.service';

@injectable()
export class DatabaseController {
    router: Router;

    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.configureRouter();
        this.databaseService.start();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/addDrawing', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .addDrawing(req.body)
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

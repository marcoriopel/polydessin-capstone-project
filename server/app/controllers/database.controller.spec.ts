import { expect } from 'chai';
import * as Httpstatus from 'http-status-codes';
import * as supertest from 'supertest';
import { DBData } from '../../../common/communication/drawing-data';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { DatabaseService } from '../services/database.service';
import { TYPES } from '../types';
import { DatabaseController } from './database.controller';

// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
// const HTTP_STATUS_CREATED = 201;

describe('DatabaseController', () => {
    let databaseService: Stubbed<DatabaseService>;
    let app: Express.Application;
    let testDBData: DBData;
    let databaseController: DatabaseController;

    beforeEach(async () => {
        testDBData = { id: '5', name: 'randomName', tags: ['tag1', 'tag2'], fileName: 'fileNameRandom' };
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DatabaseService).toConstantValue({
            getDBData: sandbox.stub().resolves([testDBData, testDBData]),
            deleteDrawing: sandbox.stub().resolves(),
            addDrawing: sandbox.stub().resolves(),
            start: sandbox.stub().resolves(),
        });
        databaseService = container.get(TYPES.DatabaseService);
        databaseController = new DatabaseController(databaseService);
        databaseController.DIR = './testing-images';
        // app = container.get<Application>(TYPES.Application).app;
        app = new Application(databaseController).app;
    });

    it('should add drawing on valid post request to root', async () => {
        return supertest(app)
            .post('/api/database/addDrawing')
            .attach('image', './images/f6dd9c4db78528f11e40e08143a21aee')
            .field({ id: 'test', name: 'meta', tags: 'tag' })
            .expect(HTTP_STATUS_OK);
    });

    it('should return error on invalid post request to root', async () => {
        databaseService.addDrawing.rejects(new Error('service error'));
        return supertest(app)
            .post('/api/database/addDrawing')
            .attach('image', './images/f6dd9c4db78528f11e40e08143a21aee')
            .field({ id: 'test', name: 'meta', tags: 'tag' })
            .expect(Httpstatus.StatusCodes.NOT_FOUND)
            .then((response: any) => {
                expect(response.text).to.equal('service error');
            });
    });

    it('should return dbdata from database service on valid get request to getDBData', async () => {
        return supertest(app)
            .get('/api/database/getDBData')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal([testDBData, testDBData]);
            });
    });

    // it('should  send image on valid get request ', async () => {
    //     return supertest(app)
    //         .get('/api/database/getDrawingPng/f6dd9c4db78528f11e40e08143a21aee')
    //         .expect(HTTP_STATUS_OK)
    //         .then((response: any) => {
    //             const size = fs.statSync('./images/f6dd9c4db78528f11e40e08143a21aee').size.toString();
    //             console.log(size);
    //             expect(response.header['content-length']).to.deep.equal(size);
    //         });
    // });

    it('should delete image file on valid delete request', async () => {
        return supertest(app).delete('/api/database/deleteDrawing/:filename').send({ filename: 'filenamerandom' }).expect(HTTP_STATUS_OK);
    });

    it('should return an error as a message on deleteDrawing service fail', async () => {
        databaseService.deleteDrawing.rejects(new Error('service error'));
        return supertest(app)
            .delete('/api/database/deleteDrawing/:filename')
            .send({ filename: 'filenamerandom' })
            .expect(Httpstatus.StatusCodes.NOT_FOUND)
            .then((response: any) => {
                expect(response.text).to.equal('service error');
            });
    });

    it('should return an error as a message on get dbdata service fail', async () => {
        databaseService.getDBData.rejects(new Error('service error'));
        return supertest(app)
            .get('/api/database/getDBData')
            .expect(Httpstatus.StatusCodes.NOT_FOUND)
            .then((response: any) => {
                expect(response.text).to.equal('service error');
            });
    });
});

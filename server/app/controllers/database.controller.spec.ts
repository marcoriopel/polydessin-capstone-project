import { expect } from 'chai';
import { describe } from 'mocha';
import * as supertest from 'supertest';
import { DBData } from '../../../common/communication/drawing-data';
import { testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { TYPES } from '../types';

// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
// const HTTP_STATUS_CREATED = 201;

describe('DatabaseController', () => {
    let app: Express.Application;
    let testDBData: DBData;

    beforeEach(async () => {
        testDBData = { id: '5', name: 'randomName', tags: ['tag1', 'tag2'], fileName: 'fileNameRandom' };
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DatabaseService).toConstantValue({
            getDBData: sandbox.stub().resolves([testDBData, testDBData]),
            deleteDrawing: sandbox.stub().resolves(),
            addDrawing: sandbox.stub().resolves(),
            start: sandbox.stub().resolves(),
        });
        // databaseService = container.get(TYPES.DatabaseService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('should return dbdata from database service on valid get request to root', async () => {
        return supertest(app)
            .get('/api/database/getDBData')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal([testDBData, testDBData]);
            });
    });

    it('should delete image file on valid delete request', async () => {
        return supertest(app).delete('/api/database/deleteDrawing/:filename').send({ filename: 'filenamerandom' }).expect(HTTP_STATUS_OK);
    });
});

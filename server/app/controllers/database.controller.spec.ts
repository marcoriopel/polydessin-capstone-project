import { expect } from 'chai';
import * as Httpstatus from 'http-status-codes';
import * as supertest from 'supertest';
import { DBData } from '../../../common/communication/drawing-data';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { DatabaseService } from '../services/database.service';
import { TYPES } from '../types';

// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
// const HTTP_STATUS_CREATED = 201;

describe('DatabaseController', () => {
    let databaseService: Stubbed<DatabaseService>;
    let app: Express.Application;
    let testDBData: DBData;
    // let exist: sinon.SinonStub;
    // let direc: sinon.SinonStub;
    // let multerStub: sinon.SinonStub;

    beforeEach(async () => {
        // exist = sinon.stub(fs, 'existsSync').withArgs('directory').returns(false);
        // direc = sinon.stub(fs, 'mkdirSync');
        // multerStub = sinon.stub(multer(), 'single');
        testDBData = { id: '5', name: 'randomName', tags: ['tag1', 'tag2'], fileName: 'fileNameRandom' };
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DatabaseService).toConstantValue({
            getDBData: sandbox.stub().resolves([testDBData, testDBData]),
            deleteDrawing: sandbox.stub().resolves(),
            addDrawing: sandbox.stub().resolves(),
            start: sandbox.stub().resolves(),
        });
        databaseService = container.get(TYPES.DatabaseService);
        app = container.get<Application>(TYPES.Application).app;
    });

    // afterEach(() => {
    //     // restore individual methods
    //     // fs.existsSync.restore()
    //     // fs.readFileSync.restore()
    //     direc.restore();
    //     exist.restore();
    // });

    // it('should check if images folder exists on controller init', async () => {
    //     sinon.assert.called(direc);
    //     sinon.assert.called(exist);
    // });

    it('should add drawing on valid post request to root', (done) => {
        // const multer = require('multer');
        // var myAPI = { single: function () {} }
        // sinon.mock(multer);
        // multer.
        // test.expects('single').throws();
        // const blob = new Blob();
        // const formData = new FormData();
        // formData.append('id', 'test');
        // formData.append('name', 'meta');
        // formData.append('tags', 'tag');
        // test.verify();
        // return supertest(app).post('/api/database/addDrawing').attach('image', './images/5a8d54c35dc0421043d34df14ceebee3').expect(HTTP_STATUS_OK);
        supertest(app)
            .post('/api/database/addDrawing')
            .attach('image', './images/23feeb959954b524a7a8a61d0a197123')
            .end((err, res) => {
                expect(res.status).to.equal(HTTP_STATUS_OK);
                done(err);
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

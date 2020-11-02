import { expect } from 'chai';
import * as fs from 'fs';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as sinon from 'sinon';
import { DBData } from '../../../common/communication/drawing-data';
import { testingContainer } from '../../test/test-utils';
import { TYPES } from '../types';
import { DatabaseService } from './database.service';

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    let db: Db;
    let client: MongoClient;
    let testDBData: DBData;
    let directoryStub: sinon.SinonStub;
    // let exist: sinon.SinonStub;
    const fileNameTest = 'fileNameRandom';
    beforeEach(async () => {
        const [container] = await testingContainer();
        databaseService = container.get<DatabaseService>(TYPES.DatabaseService);
        directoryStub = sinon.stub(fs, 'unlinkSync').returns();

        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getUri();
        client = await MongoClient.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        db = client.db(await mongoServer.getDbName());
        databaseService.collection = db.collection('test');

        testDBData = { id: '5', name: 'randomName', tags: ['tag1', 'tag2'], fileName: fileNameTest };
        databaseService.collection.insertOne(testDBData);
    });

    afterEach(async () => {
        client.close();
        directoryStub.restore();
    });

    // it( "should start DB", () => {
    //     databaseService.start();
    // });

    // it('should get all DBData from DB', async () => {
    //     const directoryStub2 = sinon.stub(fs, 'readdirSync');
    //     directoryStub2.returns(fs.Dirent[fileNameTest]);
    //     const dbData = await databaseService.getDBData();
    //     expect(dbData.length).to.equal(1);
    //     expect(testDBData).to.deep.equals(dbData[0]);
    // });

    it('should delete drawing', async () => {
        await databaseService.deleteDrawing(fileNameTest);
        const dbData = await databaseService.collection.find({}).toArray();
        expect(directoryStub.called);
        expect(dbData.length).to.equal(0);
    });

    it('should not delete a drawing if it has an invalid filename ', async () => {
        try {
            await databaseService.deleteDrawing('invalidFileName');
        } catch {
            const dbData = await databaseService.collection.find({}).toArray();
            expect(dbData.length).to.equal(1);
        }
    });

    it('should insert a new drawing', async () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag'], fileName: fileNameTest };
        await databaseService.addDrawing(DBDATA);
        const dbData = await databaseService.collection.find({}).toArray();
        expect(dbData.length).to.equal(2);
        expect(dbData.find((x) => x.name === DBDATA.name)).to.deep.equals(DBDATA);
    });

    it('should return an error if there is a problem deleting on the db', async () => {
        try {
            await client.close();
        } catch (err) {}

        try {
            await databaseService.deleteDrawing(fileNameTest);
        } catch (err) {
            expect(err);
        }
        // await client.close();
        // databaseService
        //     .deleteDrawing(fileNameTest)
        //     .then(() => {
        //         done();
        //     })
        //     .catch((error: unknown) => {
        //         expect(error);
        //         done(error);
        //     });
    });

    it('should return an error if there is a problem saving on the db', async () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag'], fileName: fileNameTest };
        client.close();
        try {
            await databaseService.addDrawing(DBDATA);
            fail();
        } catch (err) {
            expect(err);
        }
    });

    it('should not insert a new drawing if name is empty', async () => {
        const DBDATA: DBData = { id: 'test', name: '', tags: ['tag'], fileName: fileNameTest };
        try {
            await databaseService.addDrawing(DBDATA);
        } catch {
            const dbData = await databaseService.collection.find({}).toArray();
            expect(directoryStub.called);
            expect(dbData.length).to.equal(1);
        }
    });

    it('should not insert a new drawing if name is too long', async () => {
        const DBDATA: DBData = { id: 'test', name: 'namethatismorethanfifteencharacterslong', tags: ['tag'], fileName: fileNameTest };
        try {
            await databaseService.addDrawing(DBDATA);
        } catch {
            const dbData = await databaseService.collection.find({}).toArray();
            expect(directoryStub.called);
            expect(dbData.length).to.equal(1);
        }
    });

    it('should not insert a new drawing if there is more than 5 tags ', async () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6'], fileName: fileNameTest };
        try {
            await databaseService.addDrawing(DBDATA);
        } catch {
            const dbData = await databaseService.collection.find({}).toArray();
            expect(directoryStub.called);
            expect(dbData.length).to.equal(1);
        }
    });

    it('should not insert a new drawing if there is at least one tag that is too long', async () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag1', 'tagthatismorethanfifteencharacterslong'], fileName: fileNameTest };
        try {
            await databaseService.addDrawing(DBDATA);
        } catch {
            const dbData = await databaseService.collection.find({}).toArray();
            expect(directoryStub.called);
            expect(dbData.length).to.equal(1);
        }
    });

    it('should not insert a new drawing if there is one tag and that it is too long', async () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tagthatismorethanfifteencharacterslong'], fileName: fileNameTest };
        try {
            await databaseService.addDrawing(DBDATA);
        } catch {
            const dbData = await databaseService.collection.find({}).toArray();
            expect(directoryStub.called);
            expect(dbData.length).to.equal(1);
        }
    });
});

import { describe } from 'mocha';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DBData } from '../../../common/communication/drawing-data';
import { DatabaseService } from './database.service';

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    let db: Db;
    let client: MongoClient;
    let testDBData: DBData;

    beforeEach(async () => {
        databaseService = new DatabaseService();

        // Start a local test server
        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getUri();
        client = await MongoClient.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // We use the local Mongo Instance and not the production database
        db = client.db(await mongoServer.getDbName());
        databaseService.collection = db.collection('test');

        testDBData = { id: '5', name: 'randomName', tags: ['tag1', 'tag2'], fileName: 'fileNameRandom' };
        databaseService.collection.insertOne(testDBData);
    });

    afterEach(async () => {
        client.close();
    });
});

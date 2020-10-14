import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';
import { DrawingData, MetaData } from '../../../common/communication/drawing-data';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://Admin:admin@cluster0.lwqkv.mongodb.net/<dbname>?retryWrites=true&w=majority';
const DATABASE_NAME = 'database';
const DATABASE_COLLECTION = 'Drawings';

@injectable()
export class DatabaseService {
    collection: Collection<MetaData>;
    client: MongoClient;

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    start(): void {
        MongoClient.connect(DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.client = client;
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
            })
            .catch(() => {
                console.error('CONNECTION ERROR. EXITING PROCESS');
                process.exit(1);
            });
    }

    closeConnection(): void {
        this.client.close();
    }

    async addDrawing(drawing: DrawingData): Promise<void> {
        const metadata: MetaData = { id: '2', name: 'name', tags: ['tags'] };
        console.log(metadata);
        this.collection.insertOne(metadata).catch((err) => {
            throw err;
        });
    }
}

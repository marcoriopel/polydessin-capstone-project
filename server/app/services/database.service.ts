import * as fs from 'fs';
import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';
import { Drawing, DrawingData, MetaData } from '../../../common/communication/drawing-data';

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
        const metadata: MetaData = { id: drawing.id, name: drawing.name, tags: drawing.tags };
        const drawingInfo: Drawing = { id: drawing.id, drawingPng: drawing.drawingPng };
        const data = JSON.stringify(drawingInfo);
        const jsonContent = fs.readFileSync('test.json').toString();
        const jsonObj = JSON.parse(jsonContent);
        jsonObj.push(data);
        fs.writeFileSync('test.json', jsonObj);
        console.log(drawing.drawingPng);
        this.collection.insertOne(metadata).catch((err) => {
            throw err;
        });
    }
}

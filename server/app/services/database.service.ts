import * as fs from 'fs';
import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';
import { DBData, ID_NAME, MetaData, NAME, TAGS_NAME } from '../../../common/communication/drawing-data';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://Admin:admin@cluster0.lwqkv.mongodb.net/<dbname>?retryWrites=true&w=majority';
const DATABASE_NAME = 'database';
const DATABASE_COLLECTION = 'Drawings';

@injectable()
export class DatabaseService {
    collection: Collection<MetaData>;
    client: MongoClient;
    DIR: string = './images';

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

    async addDrawing(formData: FormData, imageName: string): Promise<void> {
        let metaTags: string[] = [];
        let metaId = '';
        let metaName = '';
        const formId = formData[ID_NAME];
        const formName = formData[NAME];
        const formTags = formData[TAGS_NAME];
        if (formId && formName) {
            metaId = formId.toString();
            metaName = formName.toString();
        }
        if (formTags) {
            metaTags = formTags;
        }
        const DBDATA: DBData = { id: metaId, name: metaName, tags: metaTags, fileName: imageName };
        this.collection.insertOne(DBDATA).catch((err) => {
            throw err;
        });
    }
    async deleteDrawing(fileNameToDelete: string): Promise<void> {
        fs.unlinkSync('./images/' + fileNameToDelete);
        this.collection.findOneAndDelete({ fileName: fileNameToDelete }).catch((err) => {
            throw err;
        });
    }

    async getDBData(): Promise<DBData[]> {
        return this.collection
            .find()
            .toArray()
            .then((dBData: DBData[]) => {
                const dBDataverified: DBData[] = [];
                const files: string[] = fs.readdirSync(this.DIR);
                for (const data of dBData) {
                    if (files.includes(data.fileName)) {
                        dBDataverified.push(data);
                    }
                }
                return dBDataverified;
            })
            .catch(() => {
                throw new Error('Error trying to retrieve metadata');
            });
    }
}

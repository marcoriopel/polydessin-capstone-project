import { DATABASE_COLLECTION, DATABASE_NAME, DATABASE_URL } from '@app/ressources/global-variables';
import { DBData, MetaData } from '@common/communication/drawing-data';
import * as fs from 'fs';
import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';
@injectable()
export class DatabaseService {
    collection: Collection<MetaData>;
    client: MongoClient;
    DIR: string = './images';
    mongoURL: string = DATABASE_URL;
    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    start(): void {
        MongoClient.connect(this.mongoURL, this.options)
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

    isValidData(dBData: DBData): boolean {
        if (dBData.name.length === 0) {
            return false;
        }

        if (dBData.name.length > 15) {
            return false;
        }

        if (Array.isArray(dBData.tags)) {
            if (dBData.tags.length > 5) {
                return false;
            }
            for (const tag of dBData.tags) {
                if (tag.length > 15) {
                    return false;
                }
            }
        }
        return true;
    }
    async addDrawing(DBDATA: DBData): Promise<void> {
        console.log(this.isValidData(DBDATA));
        console.log(DBDATA.tags);
        if (!this.isValidData(DBDATA)) {
            fs.unlinkSync('./images/' + DBDATA.fileName);
            throw new Error('Data is not valid');
        } else {
            await this.collection.insertOne(DBDATA).catch((err) => {
                throw err;
            });
        }
    }
    async deleteDrawing(fileNameToDelete: string): Promise<void> {
        fs.unlinkSync('./images/' + fileNameToDelete);
        await this.collection.findOneAndDelete({ fileName: fileNameToDelete }).catch((err) => {
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

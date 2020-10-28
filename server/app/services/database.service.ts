import { injectable } from 'inversify';
import { Collection, FilterQuery, MongoClient, MongoClientOptions } from 'mongodb';
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

    // async deleteDrawing(idToDelete: string): Promise<void> {
    //     const jsonContent = this.loadJSon();
    //     let jsonObj = JSON.parse(jsonContent);
    //     jsonObj = jsonObj.filter((drawing: Drawing) => {
    //         return drawing.id !== idToDelete;
    //     });
    //     const data = JSON.stringify(jsonObj, null, 2);
    //     fs.writeFileSync('drawing.json', data);
    //     this.collection.findOneAndDelete({ id: idToDelete }).catch((err) => {
    //         throw err;
    //     });
    // }

    // loadJSon(): string {
    //     return fs.readFileSync('drawing.json').toString();
    // }

    // getDrawingsJson(): Drawing[] {
    //     const drawings: Drawing[] = [];
    //     const jsonContent = this.loadJSon();
    //     const jsonObj = JSON.parse(jsonContent);
    //     jsonObj.forEach((element: Drawing) => {
    //         const drawing: Drawing = { id: element.id, drawingPng: element.drawingPng };
    //         drawings.push(drawing);
    //     });
    //     return drawings;
    // }

    // async getDrawingData(files: string[]): Promise<FormData[]> {
    //     const formDataArray: FormData[] = [];
    //     const filterQuery: FilterQuery<DBData> = { fileName: { $in: files } };
    //     let formData: FormData = new FormData();
    //     return this.collection
    //         .find(filterQuery)
    //         .toArray()
    //         .then((dBData: DBData[]) => {
    //             files.forEach((file: string) => {
    //                 dBData.forEach((dataFromDB: DBData) => {
    //                     if (file === dataFromDB.fileName) {
    //                         const PATH = './images/' + file;

    //                         fs.readFile(PATH, (err, data) => {
    //                             if (err) throw err; // Fail if the file can't be read.
    //                             formData = new FormData();
    //                             const oldData = data;
    //                             formData.append(ID_NAME, dataFromDB.id);
    //                             formData.append(NAME, dataFromDB.name);
    //                             dataFromDB.tags.forEach((tag: string) => {
    //                                 formData.append(TAGS_NAME, tag);
    //                             });
    //                             const blob = new Blob([oldData], { type: 'image/png' });
    //                             formData.append('image', blob);
    //                             formDataArray.push(formData);
    //                         });
    //                     }
    //                 });
    //             });
    //             return formDataArray;
    //         })
    //         .catch(() => {
    //             throw new Error('Error trying to retrieve metadata');
    //         });
    // }

    async getDrawingsPng(files: string[]): Promise<string[]> {
        const filterQuery: FilterQuery<DBData> = { fileName: { $in: files } };
        const images: string[] = [];
        return this.collection
            .find(filterQuery)
            .toArray()
            .then((dBData: DBData[]) => {
                files.forEach((file: string) => {
                    dBData.forEach((dataFromDB: DBData) => {
                        if (file === dataFromDB.fileName) {
                            images.push(file);
                        }
                    });
                });
                return images;
            })
            .catch(() => {
                throw new Error('Error trying to retrieve metadata');
            });
    }

    async getDBData(): Promise<DBData[]> {
        return this.collection
            .find()
            .toArray()
            .then((dBData: DBData[]) => {
                return dBData;
            })
            .catch(() => {
                throw new Error('Error trying to retrieve metadata');
            });
    }
    // getDrawingsIds(drawings: Drawing[]): string[] {
    //     const ids: string[] = [];
    //     drawings.forEach((element: Drawing) => {
    //         ids.push(element.id);
    //     });
    //     return ids;
    // }
}

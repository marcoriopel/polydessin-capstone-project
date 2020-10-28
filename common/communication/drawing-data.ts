export interface DrawingData {
    id: string;
    drawingPng: string;
    name: string;
    tags: string[];
}

export interface MetaData {
    id: string;
    name: string;
    tags: string[];
}

export interface DBData {
    id: string;
    name: string;
    tags: string[];
    fileName: string;
}

export const ID_NAME = 'id';
export const NAME = 'name';
export const TAGS_NAME = 'tags';

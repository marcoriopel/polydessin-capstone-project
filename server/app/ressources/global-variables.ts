export const DATABASE_URL = 'mongodb+srv://Admin:admin@cluster0.lwqkv.mongodb.net/<dbname>?retryWrites=true&w=majority';
export const DATABASE_NAME = 'database';
export const DATABASE_COLLECTION = 'Drawings';

export const MAX_TAG_LENGTH = 15;
export const MAX_NAME_LENGTH = 15;
export const MAX_NUMBER_TAG = 5;

enum StatusCode {
    OK = 200,
    CREATED,
    ACCEPTED,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    NOT_ACCEPTABLE = 406,
    GONE = 410,
    IM_A_TEAPOT = 418,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    DEPARTURE = 0,
}
export { StatusCode };

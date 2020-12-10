import { expect } from 'chai';
// // import { response } from 'express';
// import * as supertest from 'supertest';
// import { StatusCode } from '../ressources/global-variables';
import { TYPES } from '../types';
import { Stubbed, testingContainer } from './../../test/test-utils';
import { Application } from './../app';
import { EmailService } from './../services/email.service';

// tslint:disable: no-any
// tslint:disable: no-shadowed-variable
describe('emailcontroller', () => {
    let emailService: Stubbed<EmailService>;
    let app: Express.Application;

    before(async () => {
        const [myContainer, sandbox] = await testingContainer();
        myContainer.rebind(TYPES.EmailService).toConstantValue({ sendByEmail: sandbox.stub() });
        emailService = myContainer.get(TYPES.EmailService);
        app = myContainer.get<Application>(TYPES.Application).app;
    });

    context('positive test of the POST method :', async () => {
        // it('shold succeed and send the mail', async () => {
        //     emailService.sendByEmail.resolves(StatusCode.OK);
        //     return supertest(app)
        //         .post('api/sendByMail')
        //         .expect(StatusCode.OK)
        //         .then((response: any) => {
        //             expect(response.body).to.deep.equal(response.OK);
        //         });
        // });
    });

    // context('Negative test of the POST method  :', async () => {
    //     it('should fail and throw an error when the form data is missing' + ' some information', async () => {
    //         emailService.sendByEmail.rejects(StatusCode.BAD_REQUEST);
    //         return supertest(app)
    //             .post('/api/gallery/drawing')
    //             .catch((error: Error) => {
    //                 // expect(error.message).to.be.throws().with(response.BAD_REQUEST);
    //             });
    //     });

    //     it('should throw an error when a wrong X-Team-Key header is provided', async () => {
    //         emailService.sendByEmail.rejects(StatusCode.INTERNAL_SERVER_ERROR);

    //         return supertest(app)
    //             .post('/api/images/drawing')
    //             .catch((error: Error) => {
    //                 // expect(error.message).to.be.throws().with(response.INTERNAL_SERVER_ERROR);
    //             });
    //     });

    //     it('should fail and throw when the request does not have the appropriate structure.', async () => {
    //       emailService.sendByEmail.rejects(StatusCode.UNPROCESSABLE_ENTITY_ERROR);

    //         return supertest(app)
    //             .post('/api/images/drawing')
    //             .catch((error: Error) => {
    //                 // expect(error.message).to.be.throws().with(response.UNPROCESSABLE_ENTITY_ERROR);
    //             });
    //     });

    //     it('should fail and throw an error when the hourly requests quota is exceeded.', async () => {
    //         emailService.sendByEmail.rejects(StatusCode.TOO_MANY_REQUESTS);

    //         return supertest(app)
    //             .post('/api/images/drawing')
    //             .catch((error: Error) => {
    //                 // expect(error.message).to.be.throws().with(response.TOO_MANY_REQUESTS);
    //             });
    //     });

    //     it('should throw an error when the mail API is not reachable for some reason.', async () => {
    //         emailService.sendByEmail.rejects(StatusCode.INTERNAL_SERVER_ERROR);

    //         return supertest(app)
    //             .post('/api/images/drawing')
    //             .catch((error: Error) => {
    //                 // expect(error.message).to.be.throws().with(response.INTERNAL_SERVER_ERROR);
    //             });
    //     });
    // });
});

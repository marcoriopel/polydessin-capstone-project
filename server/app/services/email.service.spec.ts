import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import { EmailData } from '../controllers/emaildata';
import { StatusCode } from '../ressources/global-variables';
import { EmailService } from '../services/email.service';

describe('EmailService', (): void => {
    let emailService: EmailService;
    // tslint:disable-next-line: no-unused-expression
    StatusCode.DEPARTURE;
    const FILENAME = 'foo';
    const PAYLOAD = 'DEF555';
    const FORMAT = 'jpg';
    const EMAIL = 'votre_email@polymtl.ca';
    // const BADEMAIL = 'votre_email@.ca';
    let data: EmailData;
    let mockForAxios: MockAdapter;

    beforeEach(async () => {
        emailService = new EmailService();
        mockForAxios = new MockAdapter(axios);
    });

    afterEach(async () => {
        mockForAxios.restore();
    });

    it('should send the mail with the OK code', async () => {
        data = {
            to: EMAIL,
            payload: PAYLOAD,
            filename: FILENAME,
            format: FORMAT,
        } as EmailData;
        // tslint:disable-next-line: deprecation
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email?address_validation=true&quick_return=true').reply(StatusCode.OK);
        // tslint:disable-next-line: no-shadowed-variable
        await emailService.sendByEmail(data).then((status) => {
            // tslint:disable-next-line: radix
            expect(parseInt(status as string)).to.equals(StatusCode.OK);
        });
    });

    it('should send the mail with the BAD_REQUEST code', async () => {
        data = {
            to: EMAIL,
            payload: PAYLOAD,
            filename: FILENAME,
            format: FORMAT,
        } as EmailData;
        // tslint:disable-next-line: deprecation
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email?address_validation=true&quick_return=true').reply(StatusCode.BAD_REQUEST);
        // tslint:disable-next-line: no-shadowed-variable
        await emailService.sendByEmail(data).catch((error) => {
            expect(error.response.status).to.equals(StatusCode.BAD_REQUEST);
        });
    });

    it('should send the mail with the TOO_MANY_REQUESTS code', async () => {
        data = {
            to: EMAIL,
            payload: PAYLOAD,
            filename: FILENAME,
            format: FORMAT,
        } as EmailData;
        // tslint:disable-next-line: deprecation
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email?address_validation=true&quick_return=true').reply(StatusCode.TOO_MANY_REQUESTS);
        // tslint:disable-next-line: no-shadowed-variable
        await emailService.sendByEmail(data).catch((error) => {
            expect(error.response.status).to.equals(StatusCode.TOO_MANY_REQUESTS);
        });
    });

    it('should send the mail with the INTERNAL_SERVER_ERROR code', async () => {
        data = {
            to: EMAIL,
            payload: PAYLOAD,
            filename: FILENAME,
            format: FORMAT,
        } as EmailData;
        // tslint:disable-next-line: deprecation
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email?address_validation=true&quick_return=true').reply(StatusCode.INTERNAL_SERVER_ERROR);
        // tslint:disable-next-line: no-shadowed-variable
        await emailService.sendByEmail(data).catch((error) => {
            expect(error.response.status).to.equals(StatusCode.INTERNAL_SERVER_ERROR);
        });
    });

    it('should send the mail with the GONE code', async () => {
        data = {
            to: EMAIL,
            payload: PAYLOAD,
            filename: FILENAME,
            format: FORMAT,
        } as EmailData;
        // tslint:disable-next-line: deprecation
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email?address_validation=true&quick_return=true').reply(StatusCode.GONE);
        // tslint:disable-next-line: no-shadowed-variable
        await emailService.sendByEmail(data).catch((error) => {
            expect(error.response.status).to.equals(StatusCode.GONE);
        });
    });

    it('should send the mail with the IM_A_TEAPOT code', async () => {
        data = {
            to: EMAIL,
            payload: PAYLOAD,
            filename: FILENAME,
            format: FORMAT,
        } as EmailData;
        // tslint:disable-next-line: deprecation
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email?address_validation=true&quick_return=true').reply(StatusCode.IM_A_TEAPOT);
        // tslint:disable-next-line: no-shadowed-variable
        await emailService.sendByEmail(data).catch((error) => {
            expect(error.response.status).to.equals(StatusCode.IM_A_TEAPOT);
        });
    });

    // it('should throw an error when the receiver email is not provided', async () => {
    //     data = {
    //         to: BADEMAIL,
    //         payload: PAYLOAD,
    //         filename: FILENAME,
    //         format: FORMAT,
    //     } as EmailData;
    //     const invalidEmail = undefined;
    //     const invalidEmailError = "L'adresse " + invalidEmail + ' est invalide';
    //     // tslint:disable-next-line: no-shadowed-variable
    //     // tslint:disable-next-line: no-any
    //     await emailService.sendByEmail(data).catch((error: any) => {
    //         expect(error.message).to.equals(invalidEmailError);
    //     });
    // });

    // it('should throw an error when the receiver email has not the good format', async () => {
    //     data = {
    //         to: BADEMAIL,
    //         payload: PAYLOAD,
    //         filename: FILENAME,
    //         format: FORMAT,
    //     } as EmailData;
    //     const invalidEmail = 'invalid-email-format';
    //     const invalidEmailError = "L'adresse " + invalidEmail + ' est invalide';
    //     // tslint:disable-next-line: no-shadowed-variable
    //     // tslint:disable-next-line: no-any
    //     await emailService.sendByEmail(data).catch((error: any) => {
    //         expect(error.message).to.equals(invalidEmailError);
    //     });
    // });
});

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import expect from 'chai';
import * as Httpstatus from 'http-status-codes';
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
    let data: EmailData;
    let mockForAxios: MockAdapter;
    const status = 0;

    beforeEach(async () => {
        emailService = new EmailService();
        mockForAxios = new MockAdapter(axios);
    });
    data = {
        to: EMAIL,
        payload: PAYLOAD,
        filename: FILENAME,
        format: FORMAT,
    } as EmailData;

    afterEach(async () => {
        mockForAxios.restore();
    });

    it('should send the mail with the OK code', async () => {
        // tslint:disable-next-line: deprecation
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email').reply(StatusCode.OK);
        await emailService.sendByEmail(data);
        // tslint:disable-next-line: no-shadowed-variable
        emailService.sendByEmail(data).then((status) => {
            expect(status).to.equals(StatusCode.OK);
        });
    });

    it('should send the mail with the ACCEPTED code', async () => {
        // tslint:disable-next-line: deprecation
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email').reply(StatusCode.ACCEPTED);
        await emailService.sendByEmail(data);
        // tslint:disable-next-line: no-shadowed-variable
        emailService.sendByEmail(data).then((status) => {
            expect(status).to.equals(StatusCode.ACCEPTED);
        });
    });

    it('should send the mail with the BAD_REQUEST code', async () => {
        // tslint:disable-next-line: deprecation
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email').reply(StatusCode.BAD_REQUEST);
        await emailService.sendByEmail(data);
        // tslint:disable-next-line: no-shadowed-variable
        emailService.sendByEmail(data).then((status) => {
            expect(status).to.equals(StatusCode.BAD_REQUEST);
        });
    });

    it('should send the mail with the TOO_MANY_REQUESTS code', async () => {
        // tslint:disable-next-line: deprecation
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email').reply(StatusCode.TOO_MANY_REQUESTS);
        await emailService.sendByEmail(data);
        // tslint:disable-next-line: no-shadowed-variable
        emailService.sendByEmail(data).then((status) => {
            expect(status).to.equals(StatusCode.TOO_MANY_REQUESTS);
        });
    });

    it('should send the mail with the INTERNAL_SERVER_ERROR code', async () => {
        // tslint:disable-next-line: deprecation
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email').reply(StatusCode.INTERNAL_SERVER_ERROR);
        await emailService.sendByEmail(data);
        // tslint:disable-next-line: no-shadowed-variable
        emailService.sendByEmail(data).then((status) => {
            expect(status).to.equals(StatusCode.INTERNAL_SERVER_ERROR);
        });
    });

    it('should send the mail with the GONE code', async () => {
        // tslint:disable-next-line: deprecation
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email').reply(StatusCode.GONE);
        await emailService.sendByEmail(data);
        // tslint:disable-next-line: no-shadowed-variable
        emailService.sendByEmail(data).then((status) => {
            expect(status).to.equals(StatusCode.GONE);
        });
    });
});

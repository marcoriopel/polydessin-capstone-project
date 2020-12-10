import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import * as Httpstatus from 'http-status-codes';
import { EmailData } from '../controllers/emaildata';
import { EmailService } from '../services/email.service';

// tslint:disable: deprecation
// tslint:disable: radix
describe('EmailService', (): void => {
    let emailService: EmailService;
    const FILENAME = 'foo';
    const PAYLOAD = 'DEF555';
    const FORMAT = 'jpg';
    const EMAIL = 'votre_email@polymtl.ca';
    const BADEMAIL = 'votre_email@hsbs.ksk.ca';
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
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email?address_validation=true&quick_return=true').reply(Httpstatus.OK);
        await emailService.sendByEmail(data).then((status) => {
            expect(parseInt(status as string)).to.equals(Httpstatus.OK);
        });
    });

    it('should send the mail with the BAD_REQUEST code', async () => {
        data = {
            to: EMAIL,
            payload: PAYLOAD,
            filename: FILENAME,
            format: FORMAT,
        } as EmailData;
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email?address_validation=true&quick_return=true').reply(Httpstatus.BAD_REQUEST);
        await emailService.sendByEmail(data).catch((error) => {
            expect(error.response.status).to.equals(Httpstatus.BAD_REQUEST);
        });
    });

    it('should send the mail with the TOO_MANY_REQUESTS code', async () => {
        data = {
            to: EMAIL,
            payload: PAYLOAD,
            filename: FILENAME,
            format: FORMAT,
        } as EmailData;
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email?address_validation=true&quick_return=true').reply(Httpstatus.TOO_MANY_REQUESTS);
        await emailService.sendByEmail(data).catch((error) => {
            expect(error.response.status).to.equals(Httpstatus.TOO_MANY_REQUESTS);
        });
    });

    it('should send the mail with the INTERNAL_SERVER_ERROR code', async () => {
        data = {
            to: EMAIL,
            payload: PAYLOAD,
            filename: FILENAME,
            format: FORMAT,
        } as EmailData;
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email?address_validation=true&quick_return=true').reply(Httpstatus.INTERNAL_SERVER_ERROR);
        await emailService.sendByEmail(data).catch((error) => {
            expect(error.response.status).to.equals(Httpstatus.INTERNAL_SERVER_ERROR);
        });
    });

    it('should send the mail with the GONE code', async () => {
        data = {
            to: EMAIL,
            payload: PAYLOAD,
            filename: FILENAME,
            format: FORMAT,
        } as EmailData;
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email?address_validation=true&quick_return=true').reply(Httpstatus.GONE);
        await emailService.sendByEmail(data).catch((error) => {
            expect(error.response.status).to.equals(Httpstatus.GONE);
        });
    });

    it('should send the mail with the IM_A_TEAPOT code', async () => {
        data = {
            to: EMAIL,
            payload: PAYLOAD,
            filename: FILENAME,
            format: FORMAT,
        } as EmailData;
        mockForAxios.onPost('http://log2990.step.polymtl.ca/email?address_validation=true&quick_return=true').reply(Httpstatus.IM_A_TEAPOT);
        await emailService.sendByEmail(data).catch((error) => {
            expect(error.response.status).to.equals(Httpstatus.IM_A_TEAPOT);
        });
    });
});

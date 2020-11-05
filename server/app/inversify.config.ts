import { DatabaseController } from '@app/controllers/database.controller';
import { DatabaseService } from '@app/services/database.service';
import { Container } from 'inversify';
import { Application } from './app';
import { Server } from './server';
import { TYPES } from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);

    container.bind(TYPES.DatabaseController).to(DatabaseController);
    container.bind(TYPES.DatabaseService).to(DatabaseService);
    return container;
};

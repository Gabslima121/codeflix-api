import { Test } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { getConnectionToken } from '@nestjs/sequelize';

import { DatabaseModule } from './database.module';
import { ConfigModule } from '../config/config.module';

describe('Database Module Unit Tests', () => {
  describe('sqlite connection', () => {
    const connectionOpts = {
      DB_VENDOR: 'sqlite',
      DB_HOST: ':memory:',
      DB_LOGGING: false,
      DB_AUTO_LOAD_MODELS: true,
    };

    it('should be a sqlite connection', async () => {
      const module = await Test.createTestingModule({
        imports: [
          DatabaseModule,
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            ignoreEnvVars: true,
            validationSchema: null,
            load: [() => connectionOpts],
          }),
        ],
      }).compile();

      const app = module.createNestApplication();
      const connection = app.get<Sequelize>(getConnectionToken());

      expect(connection).toBeDefined();
      expect(connection.options.dialect).toBe('sqlite');
      expect(connection.options.host).toBe(':memory:');

      await connection.close();
    });
  });

  describe('mysql connection', () => {
    const connectionOpts = {
      DB_VENDOR: 'mysql',
      DB_HOST: 'db',
      DB_DATABASE: 'micro_videos',
      DB_PASSWORD: 'root',
      DB_USERNAME: 'root',
      DB_PORT: 3306,
      DB_LOGGING: false,
      DB_AUTO_LOAD_MODELS: true,
    };

    it('should be a mysql connection', async () => {
      const module = await Test.createTestingModule({
        imports: [
          DatabaseModule,
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            ignoreEnvVars: true,
            validationSchema: null,
            load: [() => connectionOpts],
          }),
        ],
      }).compile();

      const app = module.createNestApplication();
      const connection = app.get<Sequelize>(getConnectionToken());

      expect(connection).toBeDefined();
      expect(connection.options.dialect).toBe('mysql');
      expect(connection.options.host).toBe('db');
      expect(connection.options.database).toBe('micro_videos');
      expect(connection.options.username).toBe('root');
      expect(connection.options.password).toBe('root');
      expect(connection.options.port).toBe(3306);

      await connection.close();
    });
  });
});

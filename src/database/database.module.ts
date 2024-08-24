import { Global, Module } from '@nestjs/common';
import { knexSnakeCaseMappers, Model } from 'objection';
import  Knex from 'knex';
import knexConfig from 'knexfile';
import { Order} from "./models/order.model";
import { Meal } from "./models/meals.model";
import { OrderType} from "./models/order-types.model";
import { Addon } from "./models/addons.model";
import { Brand } from "./models/brands.model";
import { OrderLog } from "./models/order-logs.model";
import { CalculatedOrder } from './models/calculated-orders.model';

const models = [Order, Meal, OrderType, Addon, Brand, OrderLog, CalculatedOrder ];

const modelProviders = models.map((model) => {
  return {
    provide: model.name,
    useValue: model,
  };
});

const providers = [
  ...modelProviders,
  {
    provide: 'KnexConnection',
    useFactory: async () => {
      const knex = Knex({
        client: 'pg',
        connection: process.env.DATABASE_URL,
        debug: process.env.KNEX_DEBUG === 'true',
        ...knexSnakeCaseMappers(),
      });

      Model.knex(knex);
      return knex;
    },
  },
];


@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class DatabaseModule {}

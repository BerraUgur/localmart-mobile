import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { LoggerService } from './app/services/logger.service';

const logger = new LoggerService();
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => {
    logger.error('Global bootstrap error', err);
  });
  
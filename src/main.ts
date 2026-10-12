import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Start the standalone Angular application using the shared provider setup.
bootstrapApplication(AppComponent, appConfig).catch((error: unknown) => {
	console.error('The Angular application could not start.', error);
});

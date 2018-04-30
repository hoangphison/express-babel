'use strict';

import app from './app';
import logger from './logger';

const port = process.env.PORT || 3000;

app.listen(port, () => logger.info(`App is listening on port ${port}`));

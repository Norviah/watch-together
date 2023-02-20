import { Logger } from '@norviah/logger';
import { LOGS } from '@/util/paths';

export const logger: Logger = new Logger({ write: true, dir: LOGS });

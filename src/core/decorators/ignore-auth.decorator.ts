import { SetMetadata } from '@nestjs/common';

export const IgnoreAuth = () => SetMetadata('ignoreAuth', true);

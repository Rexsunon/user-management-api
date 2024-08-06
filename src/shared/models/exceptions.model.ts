import { HttpException } from '@nestjs/common';

export class FreePlanNotFoundException extends HttpException {
  constructor() {
    super('Free plan not found. Unable to create user.', 404);
    this.name = 'FreePlanNotFoundException';
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(`User with email ${email} already exists.`, 404);
    this.name = 'UserAlreadyExistsException';
  }
}

export class EntityAlreadyExistError extends Error {
  constructor(entityName: string) {
    super(`${entityName} already exist.`);
    this.name = 'EntityAlreadyExistError';
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

import { Request, Response, NextFunction } from 'express';
import { HttpError, errorHandler } from './error-handler';

describe('error-handler', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('HttpError', () => {
        it('should create HttpError with statusCode and message', () => {
            const error = new HttpError(404, 'Not found');

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HttpError);
            expect(error.statusCode).toBe(404);
            expect(error.message).toBe('Not found');
        });

        it('should create HttpError with different status codes', () => {
            const error400 = new HttpError(400, 'Bad request');
            const error500 = new HttpError(500, 'Server error');

            expect(error400.statusCode).toBe(400);
            expect(error500.statusCode).toBe(500);
        });
    });

    describe('errorHandler', () => {
        it('should handle HttpError and return correct status and message', () => {
            const httpError = new HttpError(400, 'Invalid input');

            errorHandler(httpError, req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Invalid input'
            });
        });

        it('should handle HttpError with different status codes', () => {
            const httpError = new HttpError(404, 'Resource not found');

            errorHandler(httpError, req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Resource not found'
            });
        });

        it('should handle generic Error and return 500 with generic message', () => {
            const genericError = new Error('Something went wrong');

            errorHandler(genericError, req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Internal server error'
            });
        });

        it('should handle Error without message and return 500', () => {
            const errorWithoutMessage = new Error();

            errorHandler(errorWithoutMessage, req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Internal server error'
            });
        });
    });
});


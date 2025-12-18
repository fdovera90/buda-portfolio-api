import { PortfolioController } from './portfolio.controller';
import { CalculatePortfolioValueUseCase } from '../usecases/calculate-portfolio-value.usecase';
import { HttpError } from '../../../shared/http/error-handler';

describe('PortfolioController', () => {
    let controller: PortfolioController;
    let useCase: CalculatePortfolioValueUseCase;
    let req: any;
    let res: any;
    let next: jest.Mock;

    beforeEach(() => {
        useCase = { execute: jest.fn() } as any;
        controller = new PortfolioController(useCase);
        req = { body: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    it('should return 400 if portfolio is missing', async () => {
        req.body = { fiat_currency: 'CLP' };
        await controller.calculateValue(req, res, next);
        expect(next).toHaveBeenCalled();
        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(HttpError);
        expect(error.statusCode).toBe(400);
    });

    it('should return 400 if fiatCurrency is missing', async () => {
        req.body = { portfolio: { BTC: 1 } };
        await controller.calculateValue(req, res, next);
        expect(next).toHaveBeenCalled();
        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(HttpError);
        expect(error.statusCode).toBe(400);
    });

    it('should call useCase and return total', async () => {
        req.body = { portfolio: { BTC: 1 }, fiat_currency: 'CLP' };
        (useCase.execute as jest.Mock).mockResolvedValue(50000);
        await controller.calculateValue(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ fiat: 'CLP', total: 50000 });
    });

    it('should call next with error if useCase fails', async () => {
        req.body = { portfolio: { BTC: 1 }, fiat_currency: 'CLP' };
        (useCase.execute as jest.Mock).mockRejectedValue(new Error('fail'));
        await controller.calculateValue(req, res, next);
        expect(next).toHaveBeenCalled();
        const error = next.mock.calls[0][0];
        expect(error.message).toBe('fail');
    });

    it('should return 400 if fiatCurrency is invalid', async () => {
        req.body = { portfolio: { BTC: 1 }, fiat_currency: 'OTHER' };
        await controller.calculateValue(req, res, next);
        expect(next).toHaveBeenCalled();
        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(HttpError);
        expect(error.statusCode).toBe(400);
    });

});

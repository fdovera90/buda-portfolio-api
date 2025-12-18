import { CalculatePortfolioValueUseCase } from './calculate-portfolio-value.usecase';
import { BudaHttpService } from '../services/buda-http.service';
import { Portfolio } from '../types/buda.types';

describe('CalculatePortfolioValueUseCase', () => {
    let budaHttpService: jest.Mocked<BudaHttpService>;
    let useCase: CalculatePortfolioValueUseCase;

    beforeEach(() => {
        budaHttpService = {
            getTicker: jest.fn()
        } as any;

        useCase = new CalculatePortfolioValueUseCase(budaHttpService);
    });

    it('should calculate the portfolio total value correctly', async () => {
        const portfolio: Portfolio = {
            BTC: 0.1,
            ETH: 1
        };

        budaHttpService.getTicker
            .mockResolvedValueOnce({
                ticker: {
                    last_price: ['50000000', 'CLP']
                }
            })
            .mockResolvedValueOnce({
                ticker: {
                    last_price: ['2000000', 'CLP']
                }
            });

        const result = await useCase.execute(portfolio, 'CLP');

        expect(result).toBe(7000000);
    });

    it('should return 0 when portfolio is empty', async () => {
        const result = await useCase.execute({}, 'CLP');
        expect(result).toBe(0);
    });

    it('should throw when price provider fails', async () => {
        budaHttpService.getTicker.mockRejectedValue(
            new Error('Buda API error')
        );

        await expect(
            useCase.execute({ BTC: 1 }, 'CLP')
        ).rejects.toThrow('Buda API error');
    });

    it('should throw HttpError when ticker response is invalid', async () => {
        budaHttpService.getTicker.mockResolvedValue({
            ticker: {
                last_price: []
            }
        } as any);

        await expect(
            useCase.execute({ BTC: 1 }, 'CLP')
        ).rejects.toThrow('Invalid response from Buda API');
    });

});

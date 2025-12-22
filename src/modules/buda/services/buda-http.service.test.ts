import { BudaHttpService } from './buda-http.service';
import { HttpService } from '../../../shared/http/http.service';
import { HttpError } from '../../../shared/http/error-handler';

describe('BudaHttpService', () => {
    let budaHttpService: BudaHttpService;
    let httpService: jest.Mocked<HttpService>;

    const originalEnv = process.env.BUDA_API_BASE_URL;

    beforeEach(() => {
        process.env.BUDA_API_BASE_URL = 'https://api.buda.com';

        httpService = {
            get: jest.fn()
        } as any;

        budaHttpService = new BudaHttpService(httpService);
    });

    afterEach(() => {
        process.env.BUDA_API_BASE_URL = originalEnv;
        jest.clearAllMocks();
    });

    it('should call http.get with correct URL when getTicker is called', async () => {
        const marketId = 'btc-clp';
        const expectedUrl = 'https://api.buda.com/api/v2/markets/btc-clp/ticker';
        const mockResponse = {
            ticker: {
                last_price: ['50000000', 'CLP']
            }
        };

        (httpService.get as jest.Mock).mockResolvedValue(mockResponse);

        const result = await budaHttpService.getTicker(marketId);

        expect(httpService.get).toHaveBeenCalledWith(expectedUrl);
        expect(httpService.get).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockResponse);
    });

    it('should handle different market IDs correctly', async () => {
        const marketId = 'eth-usd';
        const expectedUrl = 'https://api.buda.com/api/v2/markets/eth-usd/ticker';
        const mockResponse = {
            ticker: {
                last_price: ['2000', 'USD']
            }
        };

        (httpService.get as jest.Mock).mockResolvedValue(mockResponse);

        const result = await budaHttpService.getTicker(marketId);

        expect(httpService.get).toHaveBeenCalledWith(expectedUrl);
        expect(result).toEqual(mockResponse);
    });

    it('should propagate errors from http service', async () => {
        const marketId = 'btc-clp';
        const error = new Error('Network error');

        (httpService.get as jest.Mock).mockRejectedValue(error);

        await expect(budaHttpService.getTicker(marketId)).rejects.toThrow('Network error');
        expect(httpService.get).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpError 400 when API returns 404', async () => {
        const marketId = 'unknown-clp';
        const error: any = new Error('Request failed with status code 404');
        error.response = { status: 404 };

        (httpService.get as jest.Mock).mockRejectedValue(error);

        try {
            await budaHttpService.getTicker(marketId);
        } catch (e: any) {
            expect(e).toBeInstanceOf(HttpError);
            expect(e.statusCode).toBe(400);
            expect(e.message).toBe(`Market ${marketId} not found`);
        }
    });

    it('should use the baseUrl from environment variable', async () => {
        process.env.BUDA_API_BASE_URL = 'https://custom-api.buda.com';
        budaHttpService = new BudaHttpService(httpService);

        const marketId = 'btc-clp';
        const expectedUrl = 'https://custom-api.buda.com/api/v2/markets/btc-clp/ticker';

        (httpService.get as jest.Mock).mockResolvedValue({});

        await budaHttpService.getTicker(marketId);

        expect(httpService.get).toHaveBeenCalledWith(expectedUrl);
    });
});


import { HttpService } from '@shared/http/http.service';
import { Logger } from '@shared/logger/logger';

export class BudaHttpService {
    private readonly baseUrl = process.env.BUDA_API_BASE_URL!;

    constructor(private readonly http: HttpService) { }

    async getTicker(marketId: string) {
        const url = `${this.baseUrl}/api/v2/markets/${marketId}/ticker`;
        
        Logger.info('Requesting ticker from Buda API', { marketId, url });
        
        const response = await this.http.get<any>(url);

        Logger.info('Ticker response received', {
            marketId,
            data: response?.ticker
        });
        
        return response;
    }
}

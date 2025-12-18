import { HttpService } from '@shared/http/http.service';

export class BudaHttpService {
  private readonly baseUrl = process.env.BUDA_API_BASE_URL!;

  constructor(private readonly http: HttpService) {}

  getTicker(marketId: string) {
    return this.http.get<any>(
      `${this.baseUrl}/api/v2/markets/${marketId}/ticker`
    );
  }
}

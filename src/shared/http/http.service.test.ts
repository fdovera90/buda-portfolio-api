import axios from 'axios';
import { HttpService } from './http.service';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpService', () => {
    let service: HttpService;

    beforeEach(() => {
        service = new HttpService();
        jest.clearAllMocks();
    });

    it('should perform a GET request and return response data', async () => {
        const url = 'https://api.buda.com/resource';
        const data = { foo: 'bar' };

        mockedAxios.get.mockResolvedValueOnce({ data });

        const result = await service.get<typeof data>(url);

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(url);
        expect(result).toEqual(data);
    });

    it('should propagate errors from axios', async () => {
        const url = 'https://api.buda.com/error';
        const error = new Error('Network error');

        mockedAxios.get.mockRejectedValueOnce(error);

        await expect(service.get(url)).rejects.toThrow('Network error');
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(url);
    });
});



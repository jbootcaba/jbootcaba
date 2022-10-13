import axios from "axios";
jest.mock("axios");
const _mockedAxios = axios as jest.Mocked<typeof axios>;
_mockedAxios.create = jest.fn(() => mockedAxios);
export const mockedAxios = _mockedAxios;


export interface NetworkError {
  type: 'network';
  message: string;
}

export interface ApiError {
  type: 'api';
  status: number;
  code: string;
  message: string;
}

export type AppError = NetworkError | ApiError | Error;
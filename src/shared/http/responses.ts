export type ErrorResponse = {
  error: true;
  message: string;
  code: string;
};

export type DataResponse<T> = {
  data: T;
};

export type ListResponse<T> = {
  data: T[];
};

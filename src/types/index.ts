/* eslint-disable @typescript-eslint/no-explicit-any */
export type User = {
  _id: string;
};

export type ApiResponse = {
  statusCode: number;
  message: string;
  data: any;
};

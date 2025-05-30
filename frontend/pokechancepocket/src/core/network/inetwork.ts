export interface getParams {
  url: string;
  header?: Record<string, string>;
}

export default interface INetwork {
  get<T>(params: getParams): Promise<T>;
  post<T>(url: string, data: any): Promise<T>;
  put<T>(url: string, data: any): Promise<T>;
  delete<T>(url: string): Promise<T>;
}

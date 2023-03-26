export interface ResponseModel<T> {
  error: boolean;
  data: T;
  message: string;
}

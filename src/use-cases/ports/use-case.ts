export interface UseCase<TI = any, TO = any> {
  perform(request: TI): Promise<TO>
}

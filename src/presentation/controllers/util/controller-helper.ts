import { HttpRequest } from "../ports";

export function getMissingParams(
  request: HttpRequest,
  requireFields: string[]
) {
  const missingParams: string[] = [];

  requireFields.forEach((param) => {
    if (!Object.keys(request.body).includes(param)) missingParams.push(param);
  });

  return missingParams.join(", ");
}

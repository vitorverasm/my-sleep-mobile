import Env from "../../../shared/config/env";
import {
  GetSessionsByUserIdParams,
  GetSessionsByUserIdParamsSchema,
  GetSessionsByUserIdResponse,
  GetSessionsByUserIdResponseSchema,
} from "../types/session-service.type";

export async function getSessionsByUserId(params: GetSessionsByUserIdParams) {
  const paramsParse = GetSessionsByUserIdParamsSchema.safeParse(params);
  if (paramsParse.success) {
    const { userId } = paramsParse.data;

    const response = await fetch(
      `${Env.EXPO_PUBLIC_API_URL}/${userId}/sessions`,
      {
        method: "GET",
      },
    );
    const data = (await response.json()) as GetSessionsByUserIdResponse;

    return GetSessionsByUserIdResponseSchema.parse(data).intervals;
  }
}

import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../auth';
import { postApiErrorResponse } from '../../../../../../lib/http/post-api';
import { bulletinService } from '../../../../../../lib/services/bulletin';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await context.params;
    const result = await bulletinService.pin(session, id);
    return Response.json(result);
  } catch (error) {
    return postApiErrorResponse(error);
  }
}

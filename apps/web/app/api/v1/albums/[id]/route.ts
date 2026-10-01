import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../auth';
import { postApiErrorResponse } from '../../../../../lib/http/post-api';
import { albumsService } from '../../../../../lib/services/albums';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await context.params;
    const result = await albumsService.getById(session, id);
    return Response.json(result);
  } catch (error) {
    return postApiErrorResponse(error);
  }
}

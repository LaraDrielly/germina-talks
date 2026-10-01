import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../auth';
import { postApiErrorResponse } from '../../../../../lib/http/post-api';
import { albumsService } from '../../../../../lib/services/albums';
import { moderationActionSchema } from '@germina-talks/shared';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await context.params;
    const input = moderationActionSchema.parse(await request.json());
    const result = await albumsService.moderatePhoto(session, id, input);
    return Response.json(result);
  } catch (error) {
    return postApiErrorResponse(error);
  }
}

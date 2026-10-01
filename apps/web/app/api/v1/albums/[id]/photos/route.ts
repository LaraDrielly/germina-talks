import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../auth';
import { postApiErrorResponse } from '../../../../../../lib/http/post-api';
import { albumsService } from '../../../../../../lib/services/albums';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await context.params;
    const formData = await request.formData();
    const result = await albumsService.addPhoto(session, id, formData);
    return Response.json(result, { status: 201 });
  } catch (error) {
    return postApiErrorResponse(error);
  }
}

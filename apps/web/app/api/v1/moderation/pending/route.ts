import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';
import { postApiErrorResponse } from '../../../../lib/http/post-api';
import { albumsService } from '../../../../lib/services/albums';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const result = await albumsService.listPending(session);
    return Response.json(result);
  } catch (error) {
    return postApiErrorResponse(error);
  }
}

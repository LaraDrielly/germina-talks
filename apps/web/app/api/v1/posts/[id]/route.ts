import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../auth';
import { postApiErrorResponse } from '../../../../../lib/http/post-api';
import { postsService } from '../../../../../lib/services/posts';

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await context.params;
    await postsService.delete(session, id);

    return Response.json({ data: { id, deleted: true } });
  } catch (error) {
    return postApiErrorResponse(error);
  }
}
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';
import { postApiErrorResponse } from '../../../../lib/http/post-api';
import { postsService } from '../../../../lib/services/posts';
import { listPostsQuerySchema, createPostSchema } from '@germina-talks/shared';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = new URL(request.url).searchParams;
    const query = listPostsQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await postsService.list(session, query);

    return Response.json(result);
  } catch (error) {
    return postApiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const input = createPostSchema.parse(await request.json());
    const post = await postsService.create(session, input);

    return Response.json({ data: post }, { status: 201 });
  } catch (error) {
    return postApiErrorResponse(error);
  }
}
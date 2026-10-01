import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';
import { postApiErrorResponse } from '../../../../lib/http/post-api';
import { albumsService } from '../../../../lib/services/albums';
import { createAlbumSchema, listAlbumsQuerySchema } from '@germina-talks/shared';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = new URL(request.url).searchParams;
    const query = listAlbumsQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await albumsService.list(session, query);
    return Response.json(result);
  } catch (error) {
    return postApiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const input = createAlbumSchema.parse(await request.json());
    const result = await albumsService.create(session, input);
    return Response.json(result, { status: 201 });
  } catch (error) {
    return postApiErrorResponse(error);
  }
}

import { getServerSession } from 'next-auth';
import { createBulletinSchema, listBulletinsQuerySchema } from '@germina-talks/shared';
import { authOptions } from '../../../../auth';
import { postApiErrorResponse } from '../../../../lib/http/post-api';
import { bulletinService } from '../../../../lib/services/bulletin';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = new URL(request.url).searchParams;
    const query = listBulletinsQuerySchema.parse({
      scopeType: searchParams.get('scopeType') ?? undefined,
      classroomId: searchParams.get('classroomId') ?? undefined,
    });
    const result = await bulletinService.list(session, query);
    return Response.json(result);
  } catch (error) {
    return postApiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const input = createBulletinSchema.parse(await request.json());
    const result = await bulletinService.create(session, input);
    return Response.json(result, { status: 201 });
  } catch (error) {
    return postApiErrorResponse(error);
  }
}

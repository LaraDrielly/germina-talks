import { UserRole, SchoolTrack, ScopeType, MemberRole } from '@prisma/client';

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockClassroom {
  id: string;
  name: string;
  slug: string;
  schoolTrack: SchoolTrack;
  year: number;
  createdAt: Date;
}

export interface MockClassroomMember {
  userId: string;
  classroomId: string;
  role: MemberRole;
  joinedAt: Date;
}

export interface MockPost {
  id: string;
  authorId: string;
  content: string;
  scopeType: ScopeType;
  classroomId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface MockBulletinItem {
  id: string;
  authorId: string;
  title: string;
  body: string;
  isPinned: boolean;
  scopeType: ScopeType;
  classroomId: string | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface MockAlbum {
  id: string;
  title: string;
  description: string | null;
  scopeType: ScopeType;
  classroomId: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export const initialMockUsers: MockUser[] = [
  {
    id: 'user-admin-1',
    email: 'admin@institutojef.org.br',
    name: 'Coordenação J&F',
    role: UserRole.admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'user-teacher-1',
    email: 'professor.silva@institutojef.org.br',
    name: 'Prof. Carlos Silva',
    role: UserRole.teacher,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'user-student-1',
    email: 'aluno.joao@institutojef.org.br',
    name: 'João Pedro Aluno',
    role: UserRole.student,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const initialMockClassrooms: MockClassroom[] = [
  {
    id: 'class-ads-3',
    name: '3º Ano Desenvolvimento de Sistemas',
    slug: '3o-ads',
    schoolTrack: SchoolTrack.tech,
    year: 2026,
    createdAt: new Date(),
  },
  {
    id: 'class-log-2',
    name: '2º Ano Logística',
    slug: '2o-log',
    schoolTrack: SchoolTrack.business,
    year: 2026,
    createdAt: new Date(),
  },
];

export const initialMockClassroomMembers: MockClassroomMember[] = [
  {
    userId: 'user-teacher-1',
    classroomId: 'class-ads-3',
    role: MemberRole.teacher,
    joinedAt: new Date(),
  },
  {
    userId: 'user-student-1',
    classroomId: 'class-ads-3',
    role: MemberRole.student,
    joinedAt: new Date(),
  },
];

export const initialMockPosts: MockPost[] = [
  {
    id: 'post-1',
    authorId: 'user-student-1',
    content: 'Olá comunidade Germina Talks! Bem-vindos ao novo ano letivo.',
    scopeType: ScopeType.global,
    classroomId: null,
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
    deletedAt: null,
  },
  {
    id: 'post-2',
    authorId: 'user-teacher-1',
    content: 'Lembrete: Entrega do projeto integrador da turma 3º ADS na sexta-feira.',
    scopeType: ScopeType.classroom,
    classroomId: 'class-ads-3',
    createdAt: new Date(Date.now() - 1800000),
    updatedAt: new Date(Date.now() - 1800000),
    deletedAt: null,
  },
];

export const initialMockBulletinItems: MockBulletinItem[] = [
  {
    id: 'bulletin-1',
    authorId: 'user-admin-1',
    title: 'Comunicado Geral da Direção',
    body: 'As inscrições para os grêmios estudantis estão abertas até o final da semana.',
    isPinned: true,
    scopeType: ScopeType.global,
    classroomId: null,
    expiresAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

export const initialMockAlbums: MockAlbum[] = [
  {
    id: 'album-1',
    title: 'Hackathon Instituto J&F 2026',
    description: 'Fotos dos melhores momentos do hackathon de tecnologia.',
    scopeType: ScopeType.global,
    classroomId: null,
    createdBy: 'user-admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

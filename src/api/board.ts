import {
  BoardCategory,
  BoardPost,
  BoardPostItem,
  BoardType,
  EducationVideoItem,
  SeminarPost,
  SeminarPostItem,
} from '../types';
import { BASE_URL2 } from './util';
import { useAuthStore } from '../store';

// ─── 공통 ────────────────────────────────────────────────────────────

interface ApiResponse<T> {
  result?: boolean;
  success?: boolean;
  error_code?: string;
  message: string | null;
  data: T | null;
}

const authHeaders = () => {
  const token = useAuthStore.getState().token ?? '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'X-App-Token': token,
  };
};

async function boardFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: authHeaders() });
  const json: ApiResponse<T> = await res.json();
  const ok = json.success ?? json.result ?? false;
  if (!ok || json.data == null) {
    throw new Error(json.message ?? '요청에 실패했습니다.');
  }
  return json.data;
}

async function boardPost<T>(url: string, body: FormData | object): Promise<T> {
  const isFormData = body instanceof FormData;
  const token = useAuthStore.getState().token ?? '';
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'X-App-Token': token,
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: isFormData ? body : JSON.stringify(body),
  });
  const json: ApiResponse<T> = await res.json();
  const ok = json.success ?? json.result ?? false;
  if (!ok) {
    throw new Error(json.message ?? '요청에 실패했습니다.');
  }
  return json.data as T;
}

// ─── snake_case → camelCase 매퍼 ────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(raw: any): BoardPostItem {
  return {
    idx: raw.idx,
    officeIdx: raw.office_idx,
    boardType: raw.board_type,
    categoryIdx: raw.category_idx ?? null,
    categoryName: raw.category_name ?? null,
    title: raw.title,
    accountIdx: raw.account_idx,
    accountName: raw.account_name ?? '',
    viewCount: raw.view_count,
    status: raw.status,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCategory(raw: any): BoardCategory {
  return {
    idx: raw.idx,
    officeIdx: raw.office_idx,
    boardType: raw.board_type,
    name: raw.name,
    sortOrder: raw.sort_order,
    status: raw.status,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapVideo(raw: any): EducationVideoItem {
  return {
    ...mapPost(raw),
    youtubeId: raw.youtube_id,
    thumbnailUrl: raw.thumbnail_url,
    description: raw.description ?? '',
    isCompleted: raw.is_completed ?? false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSeminar(raw: any): SeminarPostItem {
  const capacity = raw.capacity ?? 0;
  const registeredCount = raw.registered_count ?? 0;
  return {
    ...mapPost(raw),
    thumbnailUrl: raw.thumbnail_url ?? '',
    startAt: raw.start_at,
    endAt: raw.end_at,
    deadline: raw.deadline,
    capacity,
    registeredCount,
    isFull: raw.is_full ?? (capacity > 0 && registeredCount >= capacity),
  };
}

// ─── 카테고리 ─────────────────────────────────────────────────────────

/** 게시판 카테고리 목록 조회 */
export const getBoardCategories = async (
  boardType: BoardType,
): Promise<BoardCategory[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await boardFetch<any>(
    `${BASE_URL2}/api/app/board/categories?board_type=${boardType}`,
  );
  const list = Array.isArray(data) ? data : (data?.categories ?? []);
  return list.map(mapCategory);
};

/** 동영상 교육 카테고리 목록 */
export const getVideoCategoriesForEducation = async (): Promise<BoardCategory[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await boardFetch<any>(
    `${BASE_URL2}/api/app/board/categories?board_type=education`,
  );
  const list = Array.isArray(data) ? data : (data?.categories ?? []);
  return list.map(mapCategory);
};

/** 교육 자료 카테고리 목록 */
export const getDocCategoriesForEducation = async (): Promise<BoardCategory[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await boardFetch<any>(
    `${BASE_URL2}/api/app/board/categories?board_type=education`,
  );
  const list = Array.isArray(data) ? data : (data?.categories ?? []);
  return list.map(mapCategory);
};

// ─── 일반 / 자유 게시판 ───────────────────────────────────────────────

export interface GetBoardPostsParams {
  boardType: BoardType;
  categoryIdx?: number | null;
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface GetBoardPostsResult {
  posts: BoardPostItem[];
  total: number;
}

/** 게시글 목록 조회 (general / free) */
export const getBoardPosts = async (
  params: GetBoardPostsParams,
): Promise<GetBoardPostsResult> => {
  const query = new URLSearchParams({ board_type: params.boardType });
  if (params.categoryIdx) query.set('category_idx', String(params.categoryIdx));
  if (params.keyword) query.set('keyword', params.keyword);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await boardFetch<any>(
    `${BASE_URL2}/api/app/board/posts?${query}`,
  );

  if (Array.isArray(data)) {
    return { posts: data.map(mapPost), total: data.length };
  }
  const posts = Array.isArray(data?.posts) ? data.posts.map(mapPost) : [];
  return { posts, total: data?.total ?? posts.length };
};

/** 게시글 상세 조회 */
export const getBoardPost = async (idx: number): Promise<BoardPost> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await boardFetch<any>(`${BASE_URL2}/api/app/board/post/${idx}`);
  const raw = data?.post ?? data;
  return { ...mapPost(raw), content: raw.content ?? '', files: raw.files ?? [] };
};

export interface CreateBoardPostParams {
  boardType: BoardType;
  categoryIdx: number | null;
  title: string;
  content: string;
  file?: { uri: string; name: string; type: string } | null;
}

/** 게시글 작성 */
export const createBoardPost = async (
  params: CreateBoardPostParams,
): Promise<{ idx: number }> => {
  if (params.file) {
    const formData = new FormData();
    formData.append('board_type', params.boardType);
    if (params.categoryIdx != null) formData.append('category_idx', String(params.categoryIdx));
    formData.append('title', params.title);
    formData.append('content', params.content);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData.append('file', { uri: params.file.uri, name: params.file.name, type: params.file.type } as any);
    return boardPost<{ idx: number }>(`${BASE_URL2}/api/app/board/post`, formData);
  }
  return boardPost<{ idx: number }>(`${BASE_URL2}/api/app/board/post`, {
    board_type: params.boardType,
    category_idx: params.categoryIdx,
    title: params.title,
    content: params.content,
  });
};

/** 게시글 삭제 */
export const deleteBoardPost = async (_idx: number): Promise<void> => {
  // TODO: 실제 API 연동
  return new Promise(resolve => setTimeout(resolve, 300));
};

// ─── 동영상 교육 ──────────────────────────────────────────────────────

export interface GetEducationVideosParams {
  categoryIdx?: number | null;
  keyword?: string;
}

/** 동영상 교육 목록 조회 */
export const getEducationVideos = async (
  params: GetEducationVideosParams,
): Promise<EducationVideoItem[]> => {
  const query = new URLSearchParams();
  if (params.categoryIdx) query.set('category_idx', String(params.categoryIdx));
  if (params.keyword) query.set('keyword', params.keyword);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await boardFetch<any>(
    `${BASE_URL2}/api/app/board/education/videos?${query}`,
  );
  const list = Array.isArray(data) ? data : (data?.videos ?? []);
  return list.map(mapVideo);
};

/** 동영상 교육 상세 조회 */
export const getEducationVideo = async (idx: number): Promise<EducationVideoItem> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await boardFetch<any>(
    `${BASE_URL2}/api/app/board/education/video/${idx}`,
  );
  const raw = data?.video ?? data;
  return mapVideo(raw);
};

// ─── 교육 자료 ────────────────────────────────────────────────────────

export interface GetEducationDocsParams {
  categoryIdx?: number | null;
  keyword?: string;
}

/** 교육 자료 목록 조회 */
export const getEducationDocs = async (
  params: GetEducationDocsParams,
): Promise<BoardPostItem[]> => {
  const query = new URLSearchParams();
  if (params.categoryIdx) query.set('category_idx', String(params.categoryIdx));
  if (params.keyword) query.set('keyword', params.keyword);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await boardFetch<any>(
    `${BASE_URL2}/api/app/board/education/docs?${query}`,
  );
  const list = Array.isArray(data) ? data : (data?.docs ?? []);
  return list.map(mapPost);
};

/** 교육 자료 상세 조회 */
export const getEducationDoc = async (idx: number): Promise<BoardPost> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await boardFetch<any>(
    `${BASE_URL2}/api/app/board/education/doc/${idx}`,
  );
  const raw = data?.doc ?? data;
  return { ...mapPost(raw), content: raw.content ?? '', files: raw.files ?? [] };
};

// ─── 세미나 ───────────────────────────────────────────────────────────

export interface GetSeminarPostsParams {
  categoryIdx?: number | null;
  keyword?: string;
}

/** 세미나 목록 조회 */
export const getSeminarPosts = async (
  params: GetSeminarPostsParams,
): Promise<SeminarPostItem[]> => {
  const query = new URLSearchParams();
  if (params.categoryIdx) query.set('category_idx', String(params.categoryIdx));
  if (params.keyword) query.set('keyword', params.keyword);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await boardFetch<any>(
    `${BASE_URL2}/api/app/board/seminars?${query}`,
  );
  const list = Array.isArray(data) ? data : (data?.seminars ?? []);
  return list.map(mapSeminar);
};

/** 세미나 상세 조회 */
export const getSeminarPost = async (idx: number): Promise<SeminarPost> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await boardFetch<any>(
    `${BASE_URL2}/api/app/board/seminar/${idx}`,
  );
  const raw = data?.seminar ?? data;
  return { ...mapSeminar(raw), description: raw.description ?? '', files: raw.files ?? [] };
};

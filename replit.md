# 민생희망대출

대출 상담 신청을 수집하고 어드민에서 관리할 수 있는 풀스택 웹사이트입니다.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API 서버 실행 (port 5000)
- `pnpm --filter @workspace/main-site run dev` — 프론트엔드 실행
- `pnpm run typecheck` — 전체 타입체크
- `pnpm run build` — 전체 빌드
- `pnpm --filter @workspace/api-spec run codegen` — OpenAPI → hooks/schemas 재생성
- `pnpm --filter @workspace/db run push` — DB 스키마 마이그레이션 (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite at `/`
- API: Express 5 at `/api`
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI 스펙 (단일 소스)
- `lib/db/src/schema/` — Drizzle DB 스키마 (applications, settings)
- `artifacts/api-server/src/routes/` — API 라우트 (applications.ts, admin.ts)
- `artifacts/api-server/src/lib/telegram.ts` — 텔레그램 봇 유틸리티
- `artifacts/main-site/src/pages/home.tsx` — 메인 랜딩 페이지
- `artifacts/main-site/src/pages/admin/` — 어드민 패널 페이지들

## Architecture decisions

- 어드민 인증: 단순 Bearer 토큰 (localStorage 저장). 배포 후에도 유지됨.
- DB 설정(텔레그램 설정)은 `settings` 테이블에 key-value 형태로 저장. 재배포 후에도 유지.
- 신청 데이터는 `applications` 테이블에 영구 저장. 재배포 무관.
- 텔레그램 봇 자동 채팅방 인식: getUpdates API로 최근 메시지의 chat 정보 추출.
- 어드민 비밀번호: `admin123` (ADMIN_PASSWORD 환경변수로 변경 가능)

## Product

- 메인 사이트 (`/`): 민생희망대출 브랜드 랜딩 + 4단계 대출 신청 폼
- 어드민 (`/admin`): 로그인 (비번: admin123)
- 어드민 대시보드 (`/admin/dashboard`): 신청 목록 조회/상태관리/메모
- 텔레그램 설정 (`/admin/telegram`): 봇 토큰 설정, 채팅방 자동 감지, 테스트 발송

## User preferences

- 상호명: 민생희망대출
- 어드민 비밀번호: admin123
- 원본 참고 사이트: seominansim.com
- 디자인: 다크 네이비/블루 프리미엄 테마

## Gotchas

- 텔레그램 채팅방 감지 전에 봇에게 메시지를 먼저 보내야 합니다 (getUpdates 방식)
- DB 데이터는 Replit Publish 흐름이 자동으로 프로덕션 스키마를 관리합니다
- 어드민 토큰은 고정값 (`admin-token-민생희망대출`) — 서버 재시작 시에도 유지

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

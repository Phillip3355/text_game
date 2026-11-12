# 상하이 여행기 · Shanghai Journey

상하이에서 보내는 사흘을 열두 장면으로 엮은 선택형 텍스트 여행 어드벤처. 서버 없이 브라우저에서만 동작한다.

- 명세: [`game.md`](game.md) · 구현 계획: [`PLAN.md`](PLAN.md)

## 실행

```bash
npm install
npm run dev          # 개발 서버
npm run build        # dist/ 에 정적 빌드 (상대 경로라 어느 하위 경로에 올려도 동작)
npm run preview
```

## 검증

```bash
npm test             # 엔진 단위 + 콘텐츠 무결성 + 자동 플레이 시뮬레이션 (Vitest)
npm run simulate     # 여행자 3종 × 전략 8종 × N회 플레이 통계 (점수·엔딩 분포·사건 도달률)
npm run test:e2e     # 실제 브라우저(데스크톱/모바일)로 표지→엔딩→일지, 새로고침 이어하기 (Playwright, 먼저 build 필요)
```

## 구조

| 경로 | 내용 |
|---|---|
| `src/engine/` | React와 무관한 순수 TS 게임 엔진 — 조건, 확률 판정, 효과, 일정·스케줄러, 점수, 엔딩, 여행일지, 저장 검증 |
| `src/content/` | 데이터만: 사건 25개(`events/`), 장소·여행자·아이템·업적·엔딩(`world.ts`), 출처가 달린 관광 정보(`facts.ts`), 미디어 메타(`media.ts`, 자동 생성) |
| `src/store/` | Zustand 스토어, LocalStorage 저장, WebAudio 효과음 |
| `src/ui/` | 책 레이아웃 화면들 |
| `scripts/media/` | Wikimedia Commons 검색 → 접촉 인화지로 수동 선별(`selection.json`) → 다운로드·메타 생성(`build_media.py`) |

사건을 추가하려면 `src/content/events/`에 `GameEvent` 객체를 하나 더 쓰고 `src/content/index.ts`의 목록에 넣으면 된다. `npm test`가 선택지 수, 기본 선택지, 참조 ID, 사진 연결, 도달 가능성을 검사한다.

## 미디어와 사실

- 사진 67장·영상 6개는 모두 Wikimedia Commons의 자유 라이선스 자료이며, 저작자·라이선스·원본 링크가 게임 안 ‘미디어 출처’ 화면과 각 사진 캡션에 표시된다.
- 관광·문화 정보 카드에는 출처 링크를 달았다. 게임 속 인물·대사·사건과 게임 내 가격(¥)은 허구다.

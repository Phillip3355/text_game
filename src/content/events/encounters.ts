import type { GameEvent } from '../../engine/types'
import { lookCheck, socialCheck, zhCheck } from './helpers'

// 우연히 일어나는 사건들 — 현재 위치에서 벌어진다.

export const E07: GameEvent = {
  id: 'E07',
  title: '지하철 환승의 미로',
  location: 'here',
  place: '지하철 인민광장역',
  kind: 'chance',
  category: 'transport',
  weight: 0.4,
  video: 'video-metro',
  media: ['metro-1', 'metro-2', 'metro-3'],
  facts: ['f_metro'],
  intro: [
    '인민광장(人民广场)역. 세 개의 노선이 만나는 환승역은 지하 도시 같다. 사람들이 각자의 방향으로 거침없이 흐르고, 바닥의 색색 화살표는 서로 엇갈린다.',
    '출구 번호와 노선 색깔이 머릿속에서 뒤섞인다. 열차가 들어오는 소리가 어디서 나는지도 모르겠다.',
  ],
  choices: [
    {
      id: 'read',
      text: '노선도와 표지판을 꼼꼼히 읽는다',
      check: lookCheck(40, [{ item: 'paper_map', bonus: 10 }]),
      success: {
        media: 'metro-3',
        text: '노선마다 색이 있다. 1호선은 빨강, 2호선은 초록, 8호선은 파랑. 색깔 화살표만 따라가면 된다는 걸 깨닫자 미로가 지도로 바뀐다. 갈아탈 승강장에 정확히 도착했다.',
        diary: '인민광장역의 복잡한 환승 통로에서 노선 색깔의 규칙을 깨닫고 혼자 길을 찾았다.',
        effects: { tags: ['solve:metro', 'culture:metro'], knowledge: ['f_metro'], count: ['nav'], stats: { observation: 1 } },
      },
      failure: {
        media: 'metro-3',
        text: '자신 있게 따라간 화살표가 반대 방향 승강장으로 이어졌다. 한 정거장을 갔다가 되돌아온다. 그래도 노선 색깔은 이제 외웠다.',
        diary: '지하철 환승을 하다 반대 방향 열차를 탔다. 한 정거장 만에 되돌아왔다.',
        effects: { knowledge: ['f_metro'], stamina: -10 },
      },
    },
    {
      id: 'ask',
      text: '옆의 대학생에게 중국어로 묻는다',
      requires: [{ type: 'stat', stat: 'chinese', min: 2 }],
      check: zhCheck(40),
      success: {
        text: '“请问，二号线在哪儿？(실례지만, 2호선 어디예요?)” 대학생이 이어폰을 빼고 웃는다. 마침 같은 방향이라며 승강장까지 함께 걸어 준다. 한국 드라마를 좋아한다며 짧은 한국어로 인사도 한다.',
        diary: '지하철역에서 대학생에게 중국어로 길을 물었다. 승강장까지 함께 걸어 주며 한국어로 인사도 했다.',
        effects: { tags: ['solve:metro', 'social:metro_student'], knowledge: ['f_metro'], count: ['zh', 'nav'] },
      },
      failure: {
        text: '대학생은 친절하게 대답하지만 너무 빠르다. “……左边……然后……” 결국 손가락이 가리킨 방향만 기억하고 걷는다. 다행히 맞았다.',
        diary: '지하철역에서 길을 물었는데 대답이 너무 빨라 손가락 방향만 기억하고 걸었다.',
        effects: { knowledge: ['f_metro'], count: ['zh-try'], stamina: -5 },
      },
    },
    {
      id: 'app',
      text: '휴대폰 지도 앱의 안내를 그대로 따른다',
      requires: [{ type: 'item', item: 'translator' }],
      success: {
        text: '앱이 알려 주는 대로 출구와 통로를 따라간다. 조금 돌아가는 길이지만 확실하다. 지하에서 신호가 끊길 때마다 가슴이 철렁한다.',
        diary: '지하철 환승은 휴대폰 앱의 안내를 따라 조금 돌아서 해냈다.',
        effects: { knowledge: ['f_metro'], stamina: -6 },
      },
    },
  ],
}

export const E17: GameEvent = {
  id: 'E17',
  title: '현지인과의 만남',
  location: 'here',
  place: '작은 공원 벤치',
  kind: 'chance',
  category: 'social',
  slots: [0, 1, 2],
  weight: 1.2,
  media: ['local-2', 'local-1'],
  facts: ['f_shanghainese', 'f_mandarin'],
  intro: [
    '잠시 쉬려고 앉은 작은 공원 벤치. 옆자리에서 새장을 손에 든 아저씨가 말을 건다. 아니, 아저씨라기엔 젊다. 서른쯤 되었을까. 할아버지의 새를 산책시키러 나왔다고 한다.',
    '“你是哪里人？(어디서 왔어요?)” 호기심 가득한 눈이다. 새장 속 새가 맑게 운다.',
  ],
  choices: [
    {
      id: 'chinese',
      text: '중국어로 대화를 이어 간다',
      requires: [{ type: 'stat', stat: 'chinese', min: 3 }],
      check: zhCheck(30, [{ stat: 'social', per: 5 }]),
      success: {
        text: '한국에서 왔다고, 상하이는 처음이라고 말한다. 그는 반가워하며 상하이 말 인사 “侬好(nóng hǎo)”를 가르쳐 준다. 이야기가 길어진다. 동네 맛집, 할아버지의 새, 상하이의 겨울. 헤어지기 전 그가 휴대폰을 내민다. “加个微信吧！(연락처 교환해요!)”',
        diary: '공원 벤치에서 새를 산책시키던 상하이 청년과 중국어로 한참 이야기를 나누고 연락처를 교환했다. 상하이 말 인사 ‘侬好’도 배웠다.',
        effects: {
          tags: ['social:local_friend', 'culture:shanghainese'],
          addItems: ['friend_contact'],
          knowledge: ['f_shanghainese'],
          followUp: 'E24',
          count: ['zh'],
          stats: { chinese: 1, social: 1 },
        },
      },
      failure: {
        text: '몇 마디 주고받았지만 금세 말문이 막힌다. 그는 웃으며 천천히 다시 말해 주고, 마지막에 “侬好” 한마디를 가르쳐 준다. 다음엔 더 길게 이야기할 수 있을 것이다.',
        diary: '공원 벤치에서 만난 청년과 중국어로 대화하다 말문이 막혔지만, 상하이 말 인사 하나를 배웠다.',
        effects: { tags: ['culture:shanghainese'], knowledge: ['f_shanghainese'], count: ['zh-try'] },
      },
    },
    {
      id: 'app',
      text: '번역 앱을 사이에 두고 이야기한다',
      requires: [{ type: 'item', item: 'translator' }],
      check: socialCheck(40),
      success: {
        text: '휴대폰을 주고받으며 대화한다. 느리지만 웃음이 끊이지 않는다. 그가 앱에 무언가를 쳐서 보여 준다. “오늘 저녁 시간 있어요? 우리 엄마 요리 최고예요.” 연락처를 주고받는다.',
        diary: '공원에서 만난 청년과 번역 앱으로 대화하며 친구가 되었다. 저녁 초대를 받았다.',
        effects: { tags: ['social:local_friend'], addItems: ['friend_contact'], followUp: 'E24', stats: { social: 1 } },
      },
      failure: {
        text: '번역 앱이 엉뚱한 문장을 내놓는다. 둘이 화면을 보며 한참 웃는다. 말은 잘 안 통했지만 즐거운 십 분이었다.',
        diary: '공원에서 만난 청년과 번역 앱으로 대화하다 엉뚱한 번역에 함께 웃었다.',
        effects: { tags: ['social:park_chat'] },
      },
    },
    {
      id: 'gesture',
      text: '말 대신 웃음과 손짓으로 새를 칭찬한다',
      success: {
        text: '새장을 가리키며 엄지를 들어 보인다. 그가 새장 덮개를 걷어 새를 자세히 보여 준다. 말은 몇 마디 오가지 않았지만, 공원의 아침이 조금 따뜻해졌다.',
        diary: '공원 벤치에서 말 대신 손짓으로 새를 칭찬하며 짧은 교류를 나누었다.',
        effects: { tags: ['social:park_chat', 'culture:park_life'], stamina: 5 },
      },
    },
    {
      id: 'pass',
      text: '정중하게 인사하고 자리를 뜬다',
      success: {
        text: '웃으며 “谢谢”라고 인사하고 일어선다. 갈 길이 바쁘다. 등 뒤로 새 소리가 한참 따라온다.',
        diary: '공원에서 말을 건 청년에게 정중히 인사하고 길을 재촉했다.',
        effects: { stamina: 3 },
      },
    },
  ],
}

export const E18: GameEvent = {
  id: 'E18',
  title: '길을 잃은 여행자',
  location: 'here',
  place: '낯선 사거리',
  kind: 'chance',
  category: 'transport',
  weight: 0.7,
  media: ['streets-2', 'streets-3'],
  intro: [
    '분명히 이 길이 맞았는데. 휴대폰 배터리는 빨간불이고, 지도 앱의 파란 점은 엉뚱한 곳에서 빙글빙글 돈다.',
    '사거리마다 비슷한 아파트, 비슷한 편의점. 해는 기울고 다리는 무겁다.',
  ],
  choices: [
    {
      id: 'map',
      text: '종이 지도를 꺼낸다',
      requires: [{ type: 'item', item: 'paper_map' }],
      success: {
        text: '배터리가 필요 없는 지도. 길 이름 표지판과 지도 위 글자를 하나씩 맞춰 본다. 세 블록만 가면 큰길이다. 연필로 동그라미를 친다.',
        diary: '휴대폰 배터리가 떨어져 길을 잃었지만, 종이 지도로 길 이름을 맞춰 가며 스스로 길을 찾았다.',
        effects: { tags: ['solve:lost'], count: ['nav'], stamina: -4 },
      },
    },
    {
      id: 'observe',
      text: '주변을 살펴 단서를 찾는다',
      check: lookCheck(35),
      success: {
        text: '길 이름 표지판에 동서남북이 적혀 있다. 해가 지는 쪽이 서쪽. 그리고 저 멀리 건물 사이로 동방명주의 꼭대기가 보인다. 방향을 잡고 걷다가, 덤으로 오래된 성당 하나를 발견한다.',
        diary: '길을 잃었지만 해와 표지판, 멀리 보이는 탑으로 방향을 잡았다. 덕분에 오래된 성당 하나를 발견했다.',
        effects: { tags: ['solve:lost', 'hidden:lost_detour'], count: ['nav'], stats: { observation: 1 }, stamina: -6 },
      },
      failure: {
        text: '단서를 찾으려 할수록 더 헷갈린다. 같은 편의점 앞을 두 번 지난다. 결국 한참을 돌아서야 아는 길이 나왔다.',
        diary: '길을 잃고 한참을 헤맸다. 같은 편의점 앞을 두 번 지났다.',
        effects: { stamina: -15 },
      },
    },
    {
      id: 'ask',
      text: '지나가는 사람에게 중국어로 묻는다',
      check: zhCheck(35, [{ stat: 'social', per: 5 }]),
      success: {
        text: '“不好意思，地铁站怎么走？(실례합니다, 지하철역 어떻게 가요?)” 장바구니를 든 아주머니가 가던 길을 멈추고 손짓을 섞어 설명해 준다. 그래도 걱정되는지 모퉁이까지 데려다주고 손을 흔든다.',
        diary: '길을 잃어 지나가던 아주머니에게 중국어로 길을 물었다. 모퉁이까지 데려다주었다.',
        effects: { tags: ['solve:lost', 'social:helpful_stranger'], count: ['zh', 'nav'], stamina: -4 },
      },
      failure: {
        text: '물어본 사람도 관광객이었다. 둘이 함께 지도를 보며 웃다가 각자 다른 방향으로 걷는다. 결국 큰길을 찾았지만 한참 걸렸다.',
        diary: '길을 물었는데 상대도 관광객이었다. 함께 웃고 각자 길을 찾았다.',
        effects: { count: ['zh-try'], stamina: -10 },
      },
    },
    {
      id: 'taxi',
      text: '택시를 잡는다',
      cost: 25,
      success: {
        text: '노란 불이 켜진 택시가 선다. 숙소 주소를 보여 주자 기사가 고개를 끄덕인다. 창밖으로 지나가는 거리를 보니, 생각보다 멀리 와 있었다.',
        diary: '길을 잃고 지쳐서 택시를 탔다.',
        effects: { stamina: 5 },
      },
    },
  ],
}

export const E19: GameEvent = {
  id: 'E19',
  title: '숨겨진 골목 탐험',
  location: 'here',
  place: '이름 모를 룽탕',
  kind: 'chance',
  category: 'special',
  slots: [0, 1, 2],
  weight: 1.4,
  requires: [
    {
      type: 'any',
      of: [
        { type: 'stat', stat: 'observation', min: 3 },
        { type: 'flag', flag: 'alley-tip' },
        { type: 'achievement', id: 'explorer' },
      ],
    },
  ],
  media: ['lilong-1', 'lilong-2', 'lilong-4'],
  facts: ['f_lilong'],
  variants: [
    {
      when: [{ type: 'flag', flag: 'alley-tip' }],
      text: ['예원의 해설가가 말한 골목이 이 근처일까. 큰길 상점 사이에 사람 하나 겨우 지나갈 만한 틈이 보인다.'],
    },
  ],
  intro: [
    '큰길의 두 건물 사이, 돌 문틀이 있는 좁은 입구. 안쪽으로 빨랫줄이 하늘을 가로지르고, 자전거 몇 대가 벽에 기대어 있다. 리룽(里弄) 골목이다.',
    '안내판도, 관광객도 없다. 골목 안쪽에서 라디오 소리와 무언가 볶는 소리가 흘러나온다.',
  ],
  choices: [
    {
      id: 'deep',
      text: '골목 끝까지 조심스럽게 들어가 본다',
      check: lookCheck(35, [{ flag: 'alley-tip', bonus: 15 }]),
      success: {
        media: 'lilong-4',
        text: '골목이 몇 번 꺾이더니 갑자기 작은 마당이 나온다. 우물 덮개 위에 화분들이 놓였고, 할머니 셋이 둥근 의자에 앉아 콩나물을 다듬는다. 고양이가 햇볕 드는 계단에서 하품한다. 지도에 없는, 이 골목 사람들만의 마당이다.',
        diary: '큰길 사이 좁은 롱탕 끝에서 지도에 없는 작은 마당을 발견했다. 할머니들이 콩나물을 다듬고 있었다.',
        effects: { tags: ['hidden:lilong_secret', 'culture:lilong_life'], knowledge: ['f_lilong'], stats: { observation: 1 }, stamina: -6 },
      },
      failure: {
        text: '골목은 막다른 벽에서 끝난다. 돌아 나오는 길, 창문 너머로 누군가와 눈이 마주친다. 실례했다는 뜻으로 고개를 숙이고 서둘러 나온다.',
        diary: '좁은 롱탕에 들어갔다가 막다른 벽을 만나 조용히 돌아 나왔다.',
        effects: { knowledge: ['f_lilong'], stamina: -8 },
      },
    },
    {
      id: 'greet',
      text: '빨래를 널던 주민에게 인사를 건넨다',
      check: socialCheck(35),
      success: {
        text: '“侬好！” 배운 상하이 말이 튀어나온다. 아주머니가 깜짝 놀라더니 크게 웃는다. 어디서 왔냐, 밥은 먹었냐 묻더니 막 쪄 낸 만두 하나를 쥐여 준다. 골목은 이렇게 이웃의 마당이었다.',
        diary: '롱탕에서 빨래를 널던 아주머니에게 인사를 건넸더니, 막 쪄 낸 만두를 하나 쥐여 주었다.',
        effects: { tags: ['social:lilong_neighbor', 'culture:lilong_life'], knowledge: ['f_lilong'], stamina: 8 },
      },
      failure: {
        text: '아주머니는 경계하는 눈빛으로 고개만 끄덕인다. 관광객이 함부로 들어오는 게 반갑지 않을 수도 있다. 조용히 물러난다.',
        diary: '롱탕 주민에게 인사했지만 반응이 냉담했다. 이곳이 누군가의 집이라는 걸 다시 생각했다.',
        effects: { knowledge: ['f_lilong'] },
      },
    },
    {
      id: 'photo',
      text: '입구에서 사진 한 장만 찍고 돌아선다',
      success: {
        text: '빨랫줄과 돌 문틀이 한 화면에 들어오도록 찍는다. 안쪽은 누군가의 삶이니까, 여기까지만.',
        diary: '롱탕 입구에서 빨랫줄과 돌 문틀을 사진에 담고 돌아섰다.',
        effects: { knowledge: ['f_lilong'] },
      },
    },
  ],
}

import type { GameEvent } from '../../engine/types'
import { cultureCheck, foodCheck, lookCheck, socialCheck, zhCheck } from './helpers'

// 와이탄·예원·신톈디·동방명주·톈쯔팡은 세 장면짜리 아크로 landmarks.ts에 있다.

export const E03: GameEvent = {
  id: 'E03',
  title: '난징루의 인파',
  location: 'nanjing_road',
  kind: 'destination',
  category: 'sight',
  slots: [1, 2, 3],
  video: 'video-nanjing',
  media: ['nanjing_road-1', 'nanjing_road-2', 'nanjing_road-3'],
  facts: ['f_nanjing_road'],
  teaser: '백 년 된 백화점과 네온사인이 이어지는 보행자 거리',
  intro: [
    '난징루(南京路) 보행자 거리. 양쪽으로 백화점과 상점이 끝없이 이어지고, 사람의 강이 그 사이를 천천히 흐른다. 작은 관광 꼬마열차가 종을 울리며 인파를 가른다.',
    '골목 어귀의 노점에서는 붉은 종이를 오린 전지(剪纸)를 판다. 오래된 식품점 앞에는 떡과자를 사려는 줄이 길다.',
  ],
  choices: [
    {
      id: 'bargain',
      text: '노점에서 전지를 흥정한다',
      requires: [{ type: 'money', min: 30 }],
      check: zhCheck(25, [{ stat: 'social', per: 8 }]),
      success: {
        text: '“太贵了，便宜一点吧？(너무 비싸요, 좀 깎아 주세요.)” 주인은 과장되게 손사래를 치다가, 결국 웃으며 절반 값에 포장해 준다. “你会讲价！(흥정할 줄 아네!)”',
        diary: '난징루 노점에서 중국어로 흥정해 붉은 전지를 절반 값에 샀다.',
        effects: { tags: ['sight:nanjing_road', 'solve:bargain'], addItems: ['paper_cut'], money: -15, count: ['zh'] },
      },
      failure: {
        text: '주인이 계산기에 숫자를 찍어 보인다. 몇 번 오가다 결국 처음 부른 값에 가깝게 산다. 비싸게 산 것 같지만, 붉은 종이 위 길상 무늬는 정말 곱다.',
        diary: '난징루 노점에서 흥정에 실패했지만, 고운 붉은 전지를 하나 샀다.',
        effects: { tags: ['sight:nanjing_road'], addItems: ['paper_cut'], money: -30 },
      },
    },
    {
      id: 'gaotuan',
      text: '오래된 식품점에서 떡과자를 산다',
      cost: 12,
      success: {
        text: '쌀가루를 찐 하얀 떡, 팥소를 넣은 경단, 계화(桂花) 향이 나는 과자. 종이봉투를 들고 걸으며 하나씩 꺼내 먹는다. 달지만 물리지 않는다.',
        diary: '난징루의 오래된 식품점에서 계화 향 나는 상하이 떡과자를 사 먹었다.',
        effects: { tags: ['sight:nanjing_road', 'food:gaotuan'], stamina: 6 },
      },
    },
    {
      id: 'rooftop',
      text: '고개를 들어 옛 건물의 꼭대기를 살핀다',
      check: lookCheck(25, [{ stat: 'culture', per: 5 }]),
      success: {
        media: 'nanjing_road-3',
        text: '네온 간판에 가려 아무도 보지 않는 위쪽. 오래된 백화점 건물 꼭대기에 시계탑과 돌 장식이 그대로 남아 있다. 이 거리가 백 년 전에도 상하이에서 가장 번화한 곳이었다는 증거다.',
        diary: '난징루의 네온사인 위, 아무도 보지 않는 옛 백화점 건물 꼭대기의 장식을 발견했다.',
        effects: { tags: ['sight:nanjing_road', 'hidden:nanjing_rooftop', 'culture:nanjing_history'], knowledge: ['f_nanjing_road'], stamina: -4 },
      },
      failure: {
        text: '위를 보며 걷다 사람들과 몇 번 부딪힌다. “不好意思！(죄송합니다!)” 오늘 가장 많이 한 중국어다.',
        diary: '난징루에서 건물을 올려다보며 걷다가 사람들과 부딪히며 “不好意思”를 연발했다.',
        effects: { tags: ['sight:nanjing_road'], stamina: -6 },
      },
    },
    {
      id: 'stroll',
      text: '인파에 섞여 거리를 걷는다',
      success: {
        text: '거리 끝까지 걷는 데 한참이 걸린다. 쇼윈도와 광고판, 버스커의 노래. 이 도시의 에너지가 발바닥으로 전해진다.',
        diary: '난징루 보행자 거리를 인파에 섞여 끝까지 걸었다.',
        effects: { tags: ['sight:nanjing_road'], knowledge: ['f_nanjing_road'], stamina: -8 },
      },
    },
  ],
}

export const E06: GameEvent = {
  id: 'E06',
  title: '루자쭈이의 하늘',
  location: 'lujiazui',
  kind: 'destination',
  category: 'sight',
  weight: 1.2,
  media: ['lujiazui-1', 'lujiazui-2', 'lujiazui-3'],
  facts: ['f_lujiazui'],
  teaser: '서른 해 만에 논밭이 마천루 숲이 된 금융 지구',
  intro: [
    '지하철역 계단을 올라오면 고개가 저절로 젖혀진다. 루자쭈이(陆家嘴). 강이 크게 굽이치는 안쪽에 유리와 강철의 탑들이 빽빽하다.',
    '가장 높이 비틀려 올라간 상하이 타워, 꼭대기에 사다리꼴 구멍이 뚫린 세계금융센터, 탑처럼 층층이 좁아지는 진마오 타워. 세 개의 탑이 나란히 서 있다.',
    '둥근 고리 모양의 공중 보행교가 교차로 위를 감싸고 있다. 정장 차림의 직장인들이 바쁘게 지나간다.',
  ],
  choices: [
    {
      id: 'skywalk',
      text: '원형 보행교에 올라 세 탑을 올려다본다',
      success: {
        media: 'lujiazui-2',
        text: '보행교 한가운데 서면 세 탑이 한눈에 들어온다. 안내판에 따르면 이 일대는 서른여 년 전만 해도 낮은 창고와 공장, 논밭이었다. 상상이 되지 않는다.',
        diary: '루자쭈이 원형 보행교에서 세 개의 마천루를 올려다보며, 이곳이 30여 년 전 논밭이었다는 사실에 놀랐다.',
        effects: { tags: ['sight:lujiazui', 'culture:modern_pudong'], knowledge: ['f_lujiazui'], stamina: -5 },
      },
    },
    {
      id: 'tower',
      text: '상하이 타워 전망대에 오른다',
      cost: 120,
      success: {
        media: 'lujiazui-3',
        text: '귀가 먹먹해질 만큼 빠른 엘리베이터. 문이 열리자 발아래로 구름과 도시가 펼쳐진다. 동방명주가 장난감처럼 작고, 황푸강이 은빛 리본처럼 도시를 가른다. 저 멀리 와이탄의 석조 건물들이 성냥갑만 하다.',
        diary: '중국에서 가장 높은 건물 상하이 타워 전망대에 올라 구름 아래 도시를 내려다보았다.',
        effects: { tags: ['sight:lujiazui', 'sight:shanghai_tower', 'culture:modern_pudong'], knowledge: ['f_lujiazui'] },
      },
    },
    {
      id: 'riverside',
      text: '강변 공원으로 내려가 숨은 전망 자리를 찾는다',
      requires: [{ type: 'stat', stat: 'observation', min: 3 }],
      check: lookCheck(30),
      success: {
        text: '빌딩 사이 좁은 계단을 따라 강변으로 내려간다. 관광객이 없는 잔디밭 끝, 나무 벤치 하나. 정면에 와이탄의 석조 건물들이 한 폭의 병풍처럼 펼쳐진다. 백 년 전의 상하이와 지금의 상하이가 강 하나를 사이에 두고 마주 보는 자리다.',
        diary: '루자쭈이 강변 공원에서 아무도 없는 벤치를 찾았다. 강 건너 와이탄이 병풍처럼 펼쳐졌다.',
        effects: { tags: ['sight:lujiazui', 'hidden:pudong_view'], stats: { observation: 1 }, stamina: -6 },
      },
      failure: {
        text: '강변으로 내려가는 길을 찾다 쇼핑몰을 세 바퀴 돌았다. 결국 사람들이 몰린 전망대 난간에서 사진 한 장.',
        diary: '루자쭈이에서 숨은 전망 자리를 찾다 쇼핑몰만 세 바퀴 돌았다.',
        effects: { tags: ['sight:lujiazui'], stamina: -10 },
      },
    },
  ],
}

export const E09: GameEvent = {
  id: 'E09',
  title: '주자자오, 물 위의 마을',
  location: 'zhujiajiao',
  kind: 'destination',
  category: 'culture',
  slots: [0, 1],
  duration: 2,
  weight: 1.1,
  media: ['zhujiajiao-1', 'zhujiajiao-2', 'zhujiajiao-3', 'zhujiajiao-4'],
  facts: ['f_zhujiajiao'],
  teaser: '도심에서 서쪽으로 약 50km, 운하와 돌다리의 수향 마을 (오가는 길 포함 반나절)',
  intro: [
    '지하철에서 내려 조금 걸으니 도시의 소음이 물소리로 바뀐다. 주자자오(朱家角). 좁은 운하를 따라 흰 벽과 검은 기와의 집들이 물 위에 그림자를 드리운다.',
    '마을 한가운데, 여러 개의 아치를 가진 커다란 돌다리가 운하를 가로지른다. 방생교(放生桥). 다리 아래로 노 젓는 나룻배가 천천히 지나간다.',
    '운하 옆 가게들에서는 대나무 잎에 싼 쭝쯔(粽子)를 찌는 김이 오른다.',
  ],
  choices: [
    {
      id: 'boat',
      text: '나룻배를 타고 운하를 돈다',
      cost: 60,
      check: zhCheck(30, [{ stat: 'social', per: 5 }]),
      success: {
        media: 'zhujiajiao-3',
        text: '뱃사공에게 중국어로 말을 거니 노를 저으며 마을 이야기를 들려준다. 저 다리는 아주 오래전에 놓였고, 옛날엔 다리 위에서 물고기를 놓아주는 풍습이 있었다고. 노 젓는 소리 사이로 그가 옛 뱃노래 한 소절을 흥얼거린다.',
        diary: '주자자오에서 나룻배를 타고 운하를 돌았다. 뱃사공이 다리의 내력을 들려주고 뱃노래를 흥얼거렸다.',
        effects: {
          tags: ['sight:zhujiajiao', 'culture:water_town', 'social:boatman', 'solve:boat_bargain'],
          knowledge: ['f_zhujiajiao'],
          count: ['zh'],
          stamina: 5,
        },
      },
      failure: {
        media: 'zhujiajiao-3',
        text: '뱃사공과는 말이 잘 통하지 않았지만, 물 위에서 보는 마을은 그 자체로 충분하다. 집집마다 물가로 내려가는 돌계단이 있다. 옛날엔 이 운하가 곧 길이었다.',
        diary: '주자자오에서 나룻배를 타고 물 위에서 마을을 바라보았다. 집마다 물가로 내려가는 돌계단이 있었다.',
        effects: { tags: ['sight:zhujiajiao', 'culture:water_town'], knowledge: ['f_zhujiajiao'], stamina: 5 },
      },
    },
    {
      id: 'bridge',
      text: '방생교 위에서 사람들을 지켜본다',
      requires: [{ type: 'stat', stat: 'observation', min: 2 }],
      success: {
        text: '다리 꼭대기에서 한 할머니가 작은 비닐봉지의 물고기를 운하로 놓아준다. 손을 모으고 잠시 눈을 감는다. 생명을 놓아 보낸다는 뜻의 ‘방생(放生)’. 이 다리의 이름이 바로 그 풍습에서 왔다.',
        diary: '주자자오 방생교 위에서 물고기를 놓아주며 기도하는 할머니를 보았다. 다리 이름이 그 풍습에서 왔다.',
        effects: { tags: ['sight:zhujiajiao', 'culture:fangsheng', 'culture:water_town'], knowledge: ['f_zhujiajiao'] },
      },
    },
    {
      id: 'zongzi',
      text: '운하 옆 가게에서 쭝쯔를 사 먹는다',
      cost: 15,
      check: foodCheck(45),
      success: {
        media: 'zhujiajiao-4',
        text: '대나무 잎을 벗기자 간장 양념이 밴 찹쌀과 고기 한 덩이가 김을 뿜는다. 가게 아주머니가 이 마을 쭝쯔는 고기가 큼직한 게 자랑이라고 한다. 운하를 보며 먹으니 더 맛있다.',
        diary: '주자자오 운하 옆에서 고기가 큼직한 쭝쯔를 사 먹었다.',
        effects: { tags: ['sight:zhujiajiao', 'food:zongzi'], stamina: 12 },
      },
      failure: {
        media: 'zhujiajiao-4',
        text: '단팥 쭝쯔를 골랐다. 생각과 다른 맛이지만 이것도 나쁘지 않다. 아주머니가 다음엔 고기 쭝쯔를 먹어 보라며 웃는다.',
        diary: '주자자오에서 쭝쯔를 사 먹었다. 고기 대신 단팥 쭝쯔를 골랐다.',
        effects: { tags: ['sight:zhujiajiao', 'food:zongzi'], stamina: 8 },
      },
    },
    {
      id: 'lanes',
      text: '관광객이 없는 뒷골목으로 걸어 들어간다',
      check: lookCheck(30),
      success: {
        media: 'zhujiajiao-2',
        text: '물길 하나를 건너자 가게가 사라진다. 대문 앞에서 콩을 까는 할머니, 물가 계단에서 빨래를 헹구는 아주머니, 처마 아래 졸고 있는 고양이. 백 년 전에도 이랬을 것 같은 오후다.',
        diary: '주자자오 뒷골목에서 빨래를 헹구고 콩을 까는, 백 년 전과 다르지 않을 오후의 풍경을 만났다.',
        effects: { tags: ['sight:zhujiajiao', 'hidden:water_lane', 'culture:water_town'], stamina: -10 },
      },
      failure: {
        media: 'zhujiajiao-2',
        text: '골목이 막다른 물가에서 끝난다. 돌아 나오는 길에 같은 다리를 세 번 건넜다.',
        diary: '주자자오 뒷골목을 헤매다 같은 다리를 세 번 건넜다.',
        effects: { tags: ['sight:zhujiajiao'], stamina: -14 },
      },
    },
  ],
}

export const E10: GameEvent = {
  id: 'E10',
  title: '상하이 박물관의 청동 솥',
  location: 'peoples_square',
  kind: 'destination',
  category: 'culture',
  slots: [0, 1, 2],
  media: ['museum-1', 'museum-2', 'museum-3'],
  facts: ['f_museum', 'f_peoples_square'],
  teaser: '고대 청동 솥을 닮은 박물관',
  intro: [
    '인민광장(人民广场) 한쪽, 둥근 지붕 아래 네모난 기단이 받친 묵직한 건물. 상하이 박물관이다. 멀리서 보면 다리 셋 달린 고대의 청동 솥을 닮았다.',
    '전시실에는 삼천 년 전의 청동기, 푸른빛 도자기, 먹으로 그린 산수화가 층마다 기다린다. 다 보려면 하루로도 모자랄 것 같다.',
  ],
  choices: [
    {
      id: 'bronze',
      text: '청동기 전시실에 집중한다',
      check: cultureCheck(35),
      success: {
        media: 'museum-2',
        text: '유리장 속 청동 솥의 표면에 짐승 얼굴 같은 무늬(饕餮纹)가 새겨져 있다. 제사에 쓰던 그릇이 곧 권력의 상징이었다는 설명을 읽고 나니, 바깥 건물의 모양이 왜 솥인지 이해가 된다.',
        diary: '상하이 박물관 청동기 전시실에서 짐승 얼굴 무늬 청동 솥을 보고, 박물관 건물이 왜 솥 모양인지 이해했다.',
        effects: { tags: ['sight:museum', 'culture:bronze'], knowledge: ['f_museum'], stats: { culture: 1 }, stamina: -8 },
      },
      failure: {
        media: 'museum-2',
        text: '비슷비슷해 보이는 청동기가 수백 점. 설명을 읽다 보니 머리가 어지럽다. 그래도 가장 큰 솥 앞에서는 한참을 서 있었다.',
        diary: '상하이 박물관의 수많은 청동기 앞에서 머리가 어지러웠지만, 가장 큰 솥 앞에서는 오래 머물렀다.',
        effects: { tags: ['sight:museum'], knowledge: ['f_museum'], stamina: -12 },
      },
    },
    {
      id: 'building',
      text: '광장을 한 바퀴 돌며 건물의 모양을 관찰한다',
      requires: [{ type: 'stat', stat: 'observation', min: 2 }],
      success: {
        text: '둥근 지붕, 네모난 바닥. 안내문에 ‘天圆地方 — 하늘은 둥글고 땅은 네모나다’는 옛 우주관을 담았다고 적혀 있다. 고대의 솥을 닮은 건물이 도심 한가운데 광장에 묵직하게 앉아 있다.',
        diary: '상하이 박물관 건물에 ‘하늘은 둥글고 땅은 네모나다’는 옛 우주관이 담겨 있음을 알았다.',
        effects: { tags: ['sight:museum', 'culture:tianyuan_difang'], knowledge: ['f_museum', 'f_peoples_square'], stamina: -5 },
      },
    },
    {
      id: 'ceramics',
      text: '도자기와 서화 전시실을 천천히 걷는다',
      requires: [{ type: 'stamina', min: 20 }],
      success: {
        text: '얇고 푸른 청자, 하얀 바탕에 코발트로 그린 청화백자. 그다음 방에서는 먹의 농담만으로 그린 산과 안개가 천 년을 건너 온다. 다리는 아프지만 눈은 즐겁다.',
        diary: '상하이 박물관에서 청자와 청화백자, 오래된 산수화를 천천히 감상했다.',
        effects: { tags: ['sight:museum', 'culture:ceramics'], stamina: -14 },
      },
    },
    {
      id: 'audio',
      text: '오디오 가이드를 빌려 핵심만 듣는다',
      cost: 20,
      success: {
        media: 'museum-3',
        text: '가이드의 목소리를 따라 대표 유물 열 점을 돈다. 청동 솥, 옥기, 도자기. 효율적인 한 시간이다.',
        diary: '상하이 박물관에서 오디오 가이드를 따라 대표 유물을 둘러보았다.',
        effects: { tags: ['sight:museum', 'culture:bronze'], knowledge: ['f_museum'], stamina: -6 },
      },
    },
  ],
}

export const E15: GameEvent = {
  id: 'E15',
  title: '우캉루의 뱃머리 건물',
  location: 'wukang_road',
  kind: 'destination',
  category: 'culture',
  slots: [0, 1, 2],
  media: ['wukang-1', 'wukang-2', 'wukang-3'],
  facts: ['f_wukang'],
  teaser: '플라타너스 그늘 아래 근대 저택과 아파트',
  intro: [
    '플라타너스 잎이 지붕처럼 드리운 길. 담장 너머로 붉은 벽돌과 흰 창틀의 오래된 저택들이 이어진다. 우캉루(武康路)다.',
    '길이 여러 갈래로 만나는 모퉁이에, 뱃머리처럼 뾰족한 붉은 벽돌 건물이 우뚝 서 있다. 우캉 맨션. 맞은편 횡단보도에는 그 건물을 찍으려는 사람들이 줄지어 서 있다.',
  ],
  choices: [
    {
      id: 'mansion',
      text: '우캉 맨션의 구조를 자세히 관찰한다',
      requires: [{ type: 'stat', stat: 'observation', min: 2 }],
      success: {
        text: '삼각형 땅에 맞춰 지었기에 뱃머리 모양이 되었다. 1층에는 아치형 회랑이 길게 이어지고, 위층의 발코니들이 파도처럼 겹친다. 1924년, 헝가리 출신 건축가 라슬로 후데크의 설계. 그는 이 도시에 수많은 건물을 남겼다.',
        diary: '우캉루의 뱃머리 건물 우캉 맨션을 관찰하고, 건축가 후데크가 1924년에 설계한 건물임을 알았다.',
        effects: { tags: ['sight:wukang', 'culture:hudec'], knowledge: ['f_wukang'], stats: { culture: 1 } },
      },
    },
    {
      id: 'plaques',
      text: '저택 담장의 표지판을 하나씩 읽으며 걷는다',
      requires: [{ type: 'stat', stat: 'culture', min: 2 }],
      check: cultureCheck(40),
      success: {
        media: 'wukang-3',
        text: '담장마다 작은 표지판이 붙어 있다. 누가 언제 이 집에 살았는지. 그중 한 집은 작가 바진(巴金)의 옛집이다. 이 길은 근대 상하이 사람들의 이야기를 모아 둔 야외 책장 같다.',
        diary: '우캉루 저택들의 표지판을 읽으며 걸었다. 작가 바진의 옛집도 이 길에 있었다.',
        effects: { tags: ['sight:wukang', 'culture:former_residences'], knowledge: ['f_wukang'], stamina: -8 },
      },
      failure: {
        media: 'wukang-3',
        text: '표지판의 이름이 대부분 낯설다. 몇 개를 사진으로 찍어 두고, 나중에 찾아보기로 한다.',
        diary: '우캉루 저택들의 표지판을 사진으로 찍어 두었다. 나중에 찾아볼 이름들이 생겼다.',
        effects: { tags: ['sight:wukang'], stamina: -8 },
      },
    },
    {
      id: 'stroll',
      text: '가로수 그늘을 따라 천천히 걷는다',
      success: {
        media: 'wukang-2',
        text: '자전거가 느긋하게 지나가고, 작은 카페 앞에 강아지가 엎드려 있다. 바쁜 도시 한가운데에서 시간이 조금 느리게 흐르는 길이다.',
        diary: '우캉루의 플라타너스 그늘을 따라 천천히 걸었다.',
        effects: { tags: ['sight:wukang', 'culture:street_life'], stamina: -4 },
      },
    },
  ],
}

export const E25: GameEvent = {
  id: 'E25',
  title: '푸싱 공원의 아침',
  location: 'fuxing_park',
  kind: 'destination',
  category: 'social',
  slots: [0, 1],
  media: ['local-1', 'local-3'],
  facts: ['f_fuxing_park'],
  teaser: '태극권과 춤, 카드놀이로 시작하는 시민들의 아침',
  intro: [
    '공원 문을 들어서자 음악 소리가 겹겹이 들려온다. 한쪽 광장에서는 수십 명이 맞춰 춤을 추고, 나무 아래에서는 흰 옷을 입은 사람들이 느릿느릿 태극권을 한다.',
    '프랑스식으로 다듬은 화단 옆 벤치에서는 할아버지들이 카드놀이에 열중하고 있다. 누군가 춤 대열 끝에서 손짓한다. 같이 하자는 걸까.',
  ],
  choices: [
    {
      id: 'dance',
      text: '광장 춤 대열에 끼어 따라 춘다',
      check: socialCheck(35),
      success: {
        media: 'local-3',
        text: '스텝이 생각보다 단순하다. 두 곡째에는 옆 아주머니와 박자가 맞기 시작한다. 음악이 끝나자 아주머니가 손뼉을 치며 말한다. “跳得好！明天再来！(잘 추네! 내일 또 와!)”',
        diary: '푸싱 공원에서 시민들의 광장 춤 대열에 끼어 함께 춤을 췄다. 내일 또 오라는 말을 들었다.',
        effects: { tags: ['sight:fuxing_park', 'social:dance_circle', 'culture:park_life'], knowledge: ['f_fuxing_park'], stats: { social: 1 }, stamina: -8 },
      },
      failure: {
        media: 'local-3',
        text: '왼발 오른발이 엉킨다. 그래도 아무도 뭐라 하지 않는다. 한 곡이 끝날 때까지 버틴 것만으로도 박수를 받았다.',
        diary: '푸싱 공원에서 광장 춤을 따라 추다 발이 엉켰지만, 끝까지 버텨서 박수를 받았다.',
        effects: { tags: ['sight:fuxing_park', 'culture:park_life'], knowledge: ['f_fuxing_park'], stamina: -10 },
      },
    },
    {
      id: 'taichi',
      text: '태극권 하는 사람들 뒤에서 동작을 따라 한다',
      success: {
        text: '천천히, 더 천천히. 숨을 들이쉬며 팔을 올리고, 내쉬며 내린다. 십 분쯤 따라 하자 몸 안쪽이 따뜻해진다. 앞줄의 할아버지가 돌아보며 고개를 끄덕여 준다.',
        diary: '푸싱 공원에서 태극권 하는 사람들 뒤에서 느린 동작을 따라 했다.',
        effects: { tags: ['sight:fuxing_park', 'culture:park_life'], knowledge: ['f_fuxing_park'], stamina: 8 },
      },
    },
    {
      id: 'cards',
      text: '카드놀이 하는 할아버지들에게 말을 건다',
      requires: [{ type: 'stat', stat: 'chinese', min: 2 }],
      check: zhCheck(25, [{ stat: 'social', per: 5 }]),
      success: {
        text: '“我可以看看吗？(구경해도 될까요?)” 할아버지들이 자리를 내준다. 판이 끝나자 한 분이 상하이 말 인사를 가르쳐 준다. “侬好(nóng hǎo)!” 따라 하자 모두 크게 웃는다.',
        diary: '푸싱 공원에서 카드놀이 하는 할아버지들 옆에 앉아 구경하다 상하이 말 인사 ‘侬好’를 배웠다.',
        effects: { tags: ['sight:fuxing_park', 'social:park_chat', 'culture:shanghainese'], knowledge: ['f_shanghainese'], count: ['zh'] },
      },
      failure: {
        text: '할아버지들은 게임에 너무 열중해 있다. 어깨 너머로 조금 구경하다 조용히 물러난다.',
        diary: '푸싱 공원에서 카드놀이 하는 할아버지들을 어깨 너머로 구경했다.',
        effects: { tags: ['sight:fuxing_park'], count: ['zh-try'] },
      },
    },
  ],
}

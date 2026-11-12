import type { GameEvent } from '../../engine/types'
import { cultureCheck, foodCheck, lookCheck, socialCheck, zhCheck } from './helpers'

export const E02: GameEvent = {
  id: 'E02',
  title: '와이탄의 석조 건물들',
  location: 'bund',
  kind: 'destination',
  category: 'sight',
  slots: [0, 1, 2],
  weight: 1.4,
  video: 'video-bund',
  media: ['bund-1', 'bund-2', 'bund-3'],
  facts: ['f_bund', 'f_huangpu'],
  teaser: '황푸강을 따라 늘어선 백 년 전의 은행 건물들',
  intro: [
    '강바람이 분다. 황푸강 서쪽 둑을 따라 화강암 건물들이 어깨를 맞대고 서 있다. 둥근 돔, 뾰족한 시계탑, 녹색 피라미드 지붕. 백 년 전 세계 각국의 은행과 상사가 경쟁하듯 지은 건물들이다.',
    '강 건너편에는 푸둥의 유리 탑들이 전혀 다른 시대처럼 솟아 있다. 시계탑에서 종이 울린다.',
    '산책로 난간에 기대 선 백발의 노신사가 건물 쪽을 바라보며 무언가를 혼자 중얼거린다.',
  ],
  choices: [
    {
      id: 'observe',
      text: '건물을 하나하나 자세히 관찰한다',
      requires: [{ type: 'stat', stat: 'observation', min: 2 }],
      success: {
        media: 'bund-2',
        text: '기둥의 양식이 건물마다 다르다. 이쪽은 그리스 신전처럼 굵은 기둥, 저쪽은 직선이 날렵한 아르데코. 옛 세관 건물의 시계탑 아래, 돌에 새겨진 연도를 찾아냈다. 1927.\n\n“만국건축박람군”이라는 별명이 왜 붙었는지 알 것 같다.',
        diary: '와이탄의 건물들을 하나하나 비교하며, 양식이 제각각인 ‘만국건축박람군’의 의미를 깨달았다.',
        effects: { tags: ['sight:bund', 'culture:bund_architecture'], knowledge: ['f_bund'], stats: { culture: 1 }, stamina: -6 },
      },
    },
    {
      id: 'elder',
      text: '노신사에게 건물 이야기를 청한다',
      check: zhCheck(30, [{ stat: 'social', per: 5 }]),
      success: {
        text: '“这栋楼啊……(이 건물 말이지……)” 노신사의 눈이 반짝인다. 저 녹색 지붕 건물은 옛날 호텔인데, 지금도 밤이면 나이 지긋한 악사들이 재즈를 연주했다고. 젊을 적 거기서 아내와 춤을 췄다며 웃는다.\n\n“晚上再来看看。(밤에 다시 와 봐요.) 강 건너 불이 켜지면 전혀 다른 곳이 되니까.”',
        diary: '와이탄에서 만난 노신사에게 화평반점의 재즈 이야기와 젊은 날의 추억을 들었다. 밤에 다시 와 보라고 했다.',
        effects: {
          tags: ['sight:bund', 'social:bund_elder', 'culture:bund_architecture'],
          knowledge: ['f_bund', 'f_peace_jazz'],
          setFlags: ['heard-jazz'],
          followUp: 'E12',
          count: ['zh'],
          stats: { social: 1 },
        },
      },
      failure: {
        text: '말을 걸었지만 노신사는 상하이 말로 빠르게 대답한다. 알아들은 것은 “外滩(와이탄)”이라는 단어 하나뿐. 서로 웃으며 고개를 끄덕이고 헤어진다.',
        diary: '와이탄에서 노신사에게 말을 걸었지만 빠른 상하이 말을 알아듣지 못하고 웃으며 헤어졌다.',
        effects: { tags: ['sight:bund'], count: ['zh-try'] },
      },
    },
    {
      id: 'walk',
      text: '강변 산책로를 따라 끝까지 걷는다',
      success: {
        text: '조깅하는 사람, 웨딩 사진을 찍는 커플, 연을 날리는 할아버지. 산책로는 생각보다 길다. 남쪽 끝에서 돌아보니 강 건너 탑들이 줄지어 따라온다.\n\n밤에 오면 저 탑들에 불이 켜질 것이다.',
        diary: '와이탄 강변 산책로를 끝까지 걸으며 강 건너 푸둥의 스카이라인을 눈에 담았다.',
        effects: { tags: ['sight:bund'], knowledge: ['f_huangpu'], stamina: -8, followUp: 'E12' },
      },
    },
    {
      id: 'bridge',
      text: '북쪽 끝 와이바이두교까지 걸어간다',
      requires: [{ type: 'stamina', min: 30 }],
      success: {
        media: 'waibaidu-2',
        text: '건물들이 끝나는 곳에 쑤저우허가 황푸강으로 흘러든다. 그 어귀에 철골 아치의 다리가 놓여 있다. 1907년에 놓인 와이바이두교. 리벳 하나하나가 백 년 넘게 버틴 흔적이다.',
        diary: '와이탄 북쪽 끝까지 걸어 1907년에 놓인 철교 와이바이두교를 건넜다.',
        effects: { tags: ['sight:bund', 'sight:waibaidu'], knowledge: ['f_waibaidu'], stamina: -12 },
      },
    },
  ],
}

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

export const E04: GameEvent = {
  id: 'E04',
  title: '예원에서의 발견',
  location: 'yuyuan',
  kind: 'destination',
  category: 'culture',
  slots: [0, 1, 2],
  weight: 1.3,
  media: ['yuyuan-1', 'yuyuan-2', 'yuyuan-4', 'yuyuan-5'],
  facts: ['f_yuyuan'],
  teaser: '명나라 관리가 부모를 위해 지은 전통 정원',
  intro: [
    '복잡한 옛 도심의 상가 골목을 지나 정원 문을 들어서자 소리가 달라진다. 처마 끝이 하늘로 휘어 오른 지붕, 잉어가 모이는 연못, 구불구불한 회랑.',
    '벽에 뚫린 둥근 문 너머로 또 다른 정원이 보이고, 그 너머로 또 하나가 보인다. 걸음을 옮길 때마다 풍경이 바뀐다.',
    '한쪽에서 관광객 몇이 처마 장식을 가리키며 저게 무슨 뜻이냐고 묻는다. 붉은 조끼를 입은 자원봉사 해설가가 근처에 서 있다.',
  ],
  choices: [
    {
      id: 'observe',
      text: '건축물과 돌 하나하나를 자세히 관찰한다',
      requires: [{ type: 'stat', stat: 'observation', min: 2 }],
      check: lookCheck(40),
      success: {
        media: 'yuyuan-5',
        text: '처마 위에 작은 용과 인물상이 줄지어 있다. 회랑의 창은 하나도 같은 무늬가 없다. 그리고 안쪽 정원에서 그것을 찾았다 — 구멍이 숭숭 뚫린 커다란 태호석, 옥영롱(玉玲珑). 아래에서 향을 피우면 구멍마다 연기가 피어오른다는 이야기가 있는 돌이다.',
        diary: '예원의 처마 장식과 창살 무늬를 관찰하다가, 구멍이 숭숭 뚫린 명석 옥영롱을 찾아냈다.',
        effects: { tags: ['sight:yuyuan', 'culture:garden', 'hidden:jade_rock'], knowledge: ['f_yuyuan'], stats: { culture: 1 }, stamina: -8 },
      },
      failure: {
        media: 'yuyuan-4',
        text: '창살 무늬가 하나씩 다르다는 건 알겠는데, 무엇을 뜻하는지는 모르겠다. 그래도 정원이 왜 ‘걸으며 보는 그림’이라 불리는지는 느낄 수 있었다.',
        diary: '예원의 창살 무늬가 하나하나 다르다는 것을 발견했다.',
        effects: { tags: ['sight:yuyuan', 'culture:garden'], knowledge: ['f_yuyuan'], stamina: -8 },
      },
    },
    {
      id: 'guide',
      text: '해설가에게 중국어로 설명을 부탁한다',
      requires: [{ type: 'stat', stat: 'chinese', min: 3 }],
      check: zhCheck(25),
      success: {
        text: '해설가는 반가운 얼굴로 정원의 내력을 들려준다. 명나라 관리가 늙은 부모를 위해 지은 정원이라 ‘豫(기쁠 예)’ 자를 썼다고. 그리고 목소리를 낮춘다.\n\n“관광객은 잘 모르는데, 정원 동쪽 골목으로 나가면 옛날 그대로 사는 동네가 있어요. 한번 들어가 봐요.”',
        diary: '예원의 자원봉사 해설가에게 정원의 이름에 담긴 효심을 듣고, 관광객이 모르는 근처 골목을 소개받았다.',
        effects: {
          tags: ['sight:yuyuan', 'culture:garden', 'social:garden_guide'],
          knowledge: ['f_yuyuan'],
          setFlags: ['alley-tip'],
          count: ['zh'],
          stats: { social: 1 },
        },
      },
      failure: {
        text: '해설가의 설명은 빠르고 전문 용어가 많다. 절반쯤 알아듣고 고개를 끄덕이자, 그는 웃으며 안내 책자 한 장을 건네준다.',
        diary: '예원 해설가의 설명을 절반쯤 알아들었다. 안내 책자를 한 장 받았다.',
        effects: { tags: ['sight:yuyuan'], knowledge: ['f_yuyuan'], count: ['zh-try'] },
      },
    },
    {
      id: 'free',
      text: '정원을 자유롭게 둘러본다',
      check: lookCheck(40),
      success: {
        media: 'yuyuan-3',
        text: '발길 닿는 대로 걷다가 정원 밖 연못가로 나왔다. 물 위로 지그재그 다리가 아홉 번 꺾이며 뻗어 있고, 그 끝에 이층 누각 찻집이 떠 있다. 사람들이 줄지어 들어간다.\n\n저기서 차 한 잔 하면 좋겠다.',
        diary: '예원을 자유롭게 거닐다 연못 위 구곡교 끝의 오래된 찻집을 발견했다.',
        effects: { tags: ['sight:yuyuan'], followUp: 'E23', stamina: -8 },
      },
      failure: {
        text: '인파에 밀려 회랑을 한 바퀴 돌고 나니 출구다. 정원은 아름다웠지만, 사람 머리를 더 많이 본 것 같다.',
        diary: '사람이 많은 예원을 인파에 밀려 한 바퀴 돌았다.',
        effects: { tags: ['sight:yuyuan'], stamina: -12 },
      },
    },
    {
      id: 'candy',
      text: '정원 앞 상가에서 리가오탕을 맛본다',
      cost: 10,
      check: foodCheck(40),
      success: {
        text: '배즙에 약재를 넣어 졸여 만든 네모난 사탕, 梨膏糖(lígāotáng). 가게 주인이 목에 좋다며 한 조각을 건넨다. 은은하게 달고 쌉쌀하다. 결국 한 상자를 산다.',
        diary: '예원 상가에서 배즙으로 만든 상하이 전통 사탕 리가오탕을 맛보고 한 상자 샀다.',
        effects: { tags: ['sight:yuyuan', 'food:ligaotang'], addItems: ['ligaotang'] },
      },
      failure: {
        text: '맛이 너무 다양해서 고르다 지쳤다. 아무거나 한 상자를 집었는데, 생각보다 한약 맛이 강하다. 그래도 목은 시원하다.',
        diary: '예원 상가에서 리가오탕을 샀는데 한약 맛이 생각보다 강했다.',
        effects: { tags: ['sight:yuyuan', 'food:ligaotang'], addItems: ['ligaotang'] },
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

export const E08: GameEvent = {
  id: 'E08',
  title: '신톈디의 돌 대문',
  location: 'xintiandi',
  kind: 'destination',
  category: 'culture',
  weight: 1.3,
  slots: [1, 2, 3],
  media: ['xintiandi-1', 'xintiandi-3', 'xintiandi-2'],
  facts: ['f_shikumen', 'f_xintiandi'],
  teaser: '옛 스쿠먼 골목을 되살린 거리',
  intro: [
    '회색 벽돌 벽에 돌로 짠 문틀, 그 안에 검게 칠한 두 짝의 나무 대문. 신톈디(新天地)의 골목은 백 년 전 상하이 사람들이 살던 스쿠먼(石库门) 주택을 그대로 살려 만들었다.',
    '지금 그 대문 안에는 카페와 식당, 작은 상점이 들어서 있다. 골목 한쪽에는 옛 스쿠먼 집 내부를 재현한 작은 전시관이 있고, 다른 쪽 모퉁이의 스쿠먼 건물 앞에는 사람들이 줄을 서 있다.',
  ],
  choices: [
    {
      id: 'museum',
      text: '스쿠먼 생활 전시관에 들어간다',
      cost: 20,
      success: {
        text: '좁고 가파른 나무 계단, 부엌 위의 작은 다락방(亭子间), 햇볕이 드는 옥상. 한 집에 여러 가족이 나눠 살던 시절의 살림살이가 그대로다. 집과 집 사이 골목이 곧 마당이었다는 설명이 붙어 있다.',
        diary: '신톈디의 스쿠먼 생활 전시관에서 좁은 계단과 다락방, 골목이 마당이던 시절의 삶을 보았다.',
        effects: { tags: ['sight:xintiandi', 'culture:shikumen'], knowledge: ['f_shikumen', 'f_lilong'], stamina: -5 },
      },
    },
    {
      id: 'doors',
      text: '대문의 돌 장식을 자세히 살핀다',
      requires: [{ type: 'stat', stat: 'observation', min: 2 }],
      success: {
        media: 'xintiandi-3',
        text: '문틀 위 반원 아치 안에 서양식 덩굴 무늬와 중국식 길상 무늬가 함께 새겨져 있다. 동양과 서양이 한 대문 위에서 만났다. 스쿠먼이 상하이에서만 태어날 수 있었던 이유다.',
        diary: '신톈디 스쿠먼 대문 위에서 서양식 덩굴 무늬와 중국식 길상 무늬가 함께 새겨진 장식을 찾았다.',
        effects: { tags: ['sight:xintiandi', 'culture:shikumen'], knowledge: ['f_shikumen'], stats: { culture: 1 } },
      },
    },
    {
      id: 'history',
      text: '모퉁이의 기념관에서 근대사를 살펴본다',
      check: cultureCheck(40),
      success: {
        media: 'xintiandi-2',
        text: '1921년 여름, 이 스쿠먼 집 안에서 중국공산당 제1차 전국대표대회가 열렸다는 설명이 붙어 있다. 작은 방 하나에 놓인 긴 탁자. 평범한 주택가의 한 집이 중국 근대사의 한 장면이 되었다.',
        diary: '신톈디 모퉁이의 기념관에서 1921년 이곳 스쿠먼 집에서 열린 회의에 관한 근대사 전시를 보았다.',
        effects: { tags: ['sight:xintiandi', 'culture:modern_history'], knowledge: ['f_xintiandi'], stamina: -5 },
      },
      failure: {
        media: 'xintiandi-2',
        text: '전시 설명이 길고 낯선 이름이 많다. 연표 몇 줄만 겨우 눈에 담고 나온다.',
        diary: '신톈디의 기념관에 들어갔지만 낯선 이름이 많아 연표 몇 줄만 기억에 남았다.',
        effects: { tags: ['sight:xintiandi'], knowledge: ['f_xintiandi'], stamina: -5 },
      },
    },
    {
      id: 'cafe',
      text: '테라스 카페에 앉아 골목을 바라본다',
      cost: 35,
      success: {
        text: '커피 한 잔을 앞에 두고 돌 대문들을 바라본다. 백 년 전 이 대문을 드나들던 사람들은 지금 이 풍경을 상상이나 했을까. 다리가 쉬는 동안 생각이 멀리 다녀온다.',
        diary: '신톈디의 테라스 카페에 앉아 스쿠먼 대문을 바라보며 쉬었다.',
        effects: { tags: ['sight:xintiandi'], stamina: 15 },
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

export const E12: GameEvent = {
  id: 'E12',
  title: '황푸강의 밤',
  location: 'bund',
  kind: 'destination',
  category: 'sight',
  slots: [3],
  weight: 1.5,
  video: 'video-night',
  media: ['huangpu_night-1', 'huangpu_night-2', 'huangpu_night-3'],
  facts: ['f_huangpu', 'f_peace_jazz'],
  teaser: '불이 켜진 강변과 강 건너 마천루',
  variants: [
    {
      when: [{ type: 'flag', flag: 'heard-jazz' }],
      text: ['낮에 만난 노신사의 말이 떠오른다. “강 건너 불이 켜지면 전혀 다른 곳이 되니까.”'],
    },
  ],
  intro: [
    '해가 지자 강이 무대가 된다. 와이탄의 석조 건물들이 금빛 조명을 받아 떠오르고, 강 건너 푸둥의 탑들은 색색의 빛을 번갈아 뿜는다.',
    '유람선이 빛의 띠를 끌며 지나가고, 강변 난간에는 사진을 찍으려는 사람들이 빼곡하다. 시민들이 타는 낡은 페리가 강을 가로질러 오간다.',
  ],
  choices: [
    {
      id: 'ferry',
      text: '시민들이 타는 페리로 강을 건넌다',
      cost: 2,
      success: {
        media: 'huangpu_night-3',
        text: '퇴근하는 사람들 틈에 섞여 페리에 오른다. 자전거를 끌고 탄 사람도 있다. 강 한가운데에서 돌아보면 양쪽 강변이 모두 빛이다. 푸시와 푸둥 — 강이 나누고 강이 잇는 도시.',
        diary: '시민들이 타는 페리를 타고 밤의 황푸강을 건넜다. 강 한가운데서 양쪽 강변의 불빛을 모두 보았다.',
        effects: { tags: ['sight:huangpu_night', 'culture:huangpu'], knowledge: ['f_huangpu'], stamina: -4 },
      },
    },
    {
      id: 'cruise',
      text: '유람선을 타고 강을 오르내린다',
      cost: 100,
      success: {
        media: 'huangpu_night-2',
        text: '갑판 위로 밤바람이 분다. 와이탄과 루자쭈이 사이를 천천히 오르내리는 한 시간. 건물들이 빛의 그림책처럼 한 장씩 넘어간다.',
        diary: '유람선을 타고 밤의 황푸강을 오르내리며 빛나는 와이탄과 루자쭈이를 바라보았다.',
        effects: { tags: ['sight:huangpu_night', 'culture:huangpu'], knowledge: ['f_huangpu'], stamina: 10 },
      },
    },
    {
      id: 'photo',
      text: '사람이 없는 자리를 찾아 야경을 촬영한다',
      check: lookCheck(30, [{ stat: 'culture', per: 3 }]),
      success: {
        text: '난간 끝, 가로등 기둥에 휴대폰을 기대어 흔들림을 막는다. 셔터를 누르는 순간 유람선 한 척이 화면 한가운데로 미끄러져 들어온다. 완벽한 한 장.',
        diary: '황푸강 야경을 찍다가 유람선이 화면 한가운데로 들어오는 완벽한 순간을 담았다.',
        effects: { tags: ['sight:huangpu_night', 'solve:night_shot'], addItems: ['night_photo'], stamina: -4 },
      },
      failure: {
        text: '찍는 사진마다 누군가의 머리나 셀카봉이 걸린다. 결국 휴대폰을 내리고 눈으로 본다. 그것도 나쁘지 않다.',
        diary: '황푸강 야경 사진은 실패했지만, 휴대폰을 내리고 눈으로 오래 보았다.',
        effects: { tags: ['sight:huangpu_night'], stamina: -4 },
      },
    },
    {
      id: 'jazz',
      text: '노신사가 말한 호텔의 재즈 바에 간다',
      requires: [{ type: 'flag', flag: 'heard-jazz' }],
      cost: 60,
      success: {
        text: '아르데코 장식의 로비를 지나 어둑한 바. 흰 머리의 연주자들이 느긋하게 스윙을 연주한다. 트럼펫 소리가 1930년대의 상하이를 데려온다. 노신사가 젊은 날 춤을 췄다는 곳이 여기였을까.',
        diary: '와이탄의 노신사가 알려 준 화평반점 재즈 바에서 흰 머리 연주자들의 올드 재즈를 들었다.',
        effects: { tags: ['sight:huangpu_night', 'culture:old_jazz'], knowledge: ['f_peace_jazz'], stamina: 5 },
      },
    },
  ],
}

export const E13: GameEvent = {
  id: 'E13',
  title: '동방명주의 구슬',
  location: 'oriental_pearl',
  kind: 'destination',
  category: 'sight',
  weight: 1.7,
  slots: [1, 2, 3],
  media: ['oriental_pearl-1', 'oriental_pearl-3', 'oriental_pearl-2'],
  facts: ['f_oriental_pearl'],
  teaser: '구슬을 꿴 듯한 상하이의 상징 방송탑',
  intro: [
    '분홍빛 구슬을 꿰어 세운 듯한 탑. 동방명주(东方明珠)는 사진으로 수없이 봤지만 아래에서 올려다보니 생각보다 훨씬 크다.',
    '굵은 기둥 세 개가 비스듬히 커다란 구슬을 받치고, 그 위로 작은 구슬들이 하늘을 향해 이어진다. 전망대로 올라가는 줄이 길게 늘어서 있다.',
  ],
  choices: [
    {
      id: 'glass',
      text: '전망대의 유리 바닥 위에 서 본다',
      cost: 100,
      check: { base: 55, mods: [{ stat: 'observation', per: 5 }, { traveler: 'wanderer', bonus: 10 }] },
      success: {
        media: 'oriental_pearl-2',
        text: '발아래가 투명하다. 수백 미터 아래로 자동차들이 개미처럼 움직인다. 숨을 한 번 고르고 한가운데로 걸어가 선다. 무릎이 떨리지만, 해냈다.',
        diary: '동방명주 전망대의 유리 바닥 한가운데에 섰다. 무릎이 떨렸지만 해냈다.',
        effects: { tags: ['sight:oriental_pearl', 'solve:glass_floor'], knowledge: ['f_oriental_pearl'], stamina: -6 },
      },
      failure: {
        media: 'oriental_pearl-2',
        text: '유리 위에 한 발을 올리는 순간 다리가 굳는다. 결국 가장자리 난간을 붙잡고 창밖만 본다. 창밖 풍경만으로도 충분히 아찔하다.',
        diary: '동방명주 전망대의 유리 바닥에는 끝내 올라서지 못했지만, 창밖 풍경만으로도 아찔했다.',
        effects: { tags: ['sight:oriental_pearl'], knowledge: ['f_oriental_pearl'], stamina: -8 },
      },
    },
    {
      id: 'design',
      text: '탑 아래 공원에서 구조를 찬찬히 뜯어본다',
      requires: [{ type: 'stat', stat: 'observation', min: 2 }],
      check: cultureCheck(45),
      success: {
        text: '크고 작은 구슬이 높이마다 다르게 배치되어 있다. 안내판에 따르면 당나라 시 「비파행」의 ‘큰 구슬 작은 구슬이 옥 쟁반에 떨어지네’라는 구절에서 영감을 얻었다고 한다. 강철 탑에 시 한 구절이 들어 있었다.',
        diary: '동방명주의 구슬 배치가 당나라 시 「비파행」의 한 구절에서 영감을 얻었다는 것을 알게 되었다.',
        effects: { tags: ['sight:oriental_pearl', 'culture:pearl_design'], knowledge: ['f_oriental_pearl'] },
      },
      failure: {
        text: '구슬이 몇 개인지 세다가 포기했다. 그래도 아래에서 올려다본 각도는 어떤 엽서보다 극적이다.',
        diary: '동방명주의 구슬을 세어 보다 포기했다. 아래서 올려다본 탑은 엽서보다 극적이었다.',
        effects: { tags: ['sight:oriental_pearl'] },
      },
    },
    {
      id: 'photo',
      text: '탑을 배경으로 사진 한 장만 찍고 떠난다',
      success: {
        text: '줄을 서는 대신 길 건너에서 탑이 한 화면에 다 들어오는 자리를 찾는다. 찰칵. 남은 시간은 다른 곳에 쓰기로 한다.',
        diary: '동방명주를 배경으로 사진 한 장을 찍고 다음 장소로 향했다.',
        effects: { tags: ['sight:oriental_pearl'], stamina: 3 },
      },
    },
  ],
}

export const E14: GameEvent = {
  id: 'E14',
  title: '톈쯔팡의 미로',
  location: 'tianzifang',
  kind: 'destination',
  category: 'culture',
  slots: [1, 2, 3],
  media: ['tianzifang-1', 'tianzifang-2', 'tianzifang-3'],
  facts: ['f_tianzifang', 'f_lilong'],
  teaser: '공방과 갤러리가 숨은 스쿠먼 골목',
  intro: [
    '어깨가 닿을 만큼 좁은 골목이 거미줄처럼 얽혀 있다. 톈쯔팡(田子坊). 스쿠먼 집의 1층마다 공방과 갤러리, 찻집이 들어섰고, 위층 창문에는 여전히 빨래가 걸려 있다.',
    '관광객과 주민이 같은 골목을 쓴다. 한쪽에서는 화가가 이젤 앞에 앉아 골목 풍경을 그리고 있다.',
  ],
  choices: [
    {
      id: 'workshop',
      text: '공방을 돌아보고 엽서 한 장을 산다',
      cost: 15,
      success: {
        text: '도장 새기는 집, 염색 천을 파는 집, 손으로 그린 엽서를 파는 집. 스쿠먼 대문을 그린 엽서 한 장을 고른다. 1990년대 말 예술가들이 빈 공장에 작업실을 내면서 이 골목이 바뀌기 시작했다고 주인이 말해 준다.',
        diary: '톈쯔팡의 공방들을 둘러보고, 스쿠먼 대문이 그려진 엽서를 샀다.',
        effects: { tags: ['sight:tianzifang', 'culture:art_lanes'], addItems: ['postcard'], knowledge: ['f_tianzifang'], stamina: -5 },
      },
    },
    {
      id: 'deeper',
      text: '골목 가장 깊은 곳까지 들어가 본다',
      requires: [{ type: 'stat', stat: 'observation', min: 3 }],
      success: {
        media: 'tianzifang-2',
        text: '가게 간판이 끊기는 곳에서 한 번 더 꺾는다. 연탄 화로 위에서 무언가 끓고, 할아버지가 대나무 의자에 앉아 라디오를 듣는다. 여기는 관광지가 아니라 누군가의 집 앞이다. 조용히 목례하고 돌아 나온다.',
        diary: '톈쯔팡의 가장 깊은 골목에서 가게 대신 주민들의 일상을 만났다. 조용히 목례하고 돌아 나왔다.',
        effects: { tags: ['sight:tianzifang', 'hidden:resident_lane', 'culture:lilong_life'], knowledge: ['f_lilong'], stamina: -6 },
      },
    },
    {
      id: 'painter',
      text: '그림 그리는 화가에게 말을 건다',
      check: socialCheck(30),
      success: {
        text: '화가는 붓을 멈추고 이 골목에서 30년을 살았다고 말한다. 예전엔 작은 공장들이 있었고, 예술가들이 들어오며 골목이 바뀌었다고. “变了很多，但是人还在。(많이 변했지만, 사람은 그대로예요.)” 스케치북 귀퉁이에 내 얼굴을 쓱쓱 그려 준다.',
        diary: '톈쯔팡의 화가와 이야기를 나누었다. 30년 동안 변한 골목 이야기를 듣고, 내 얼굴 스케치를 받았다.',
        effects: { tags: ['sight:tianzifang', 'social:painter', 'culture:art_lanes'], knowledge: ['f_tianzifang'], count: ['zh'], stats: { social: 1 } },
      },
      failure: {
        text: '화가는 그림에 집중하느라 짧게 고개만 끄덕인다. 방해하지 않으려 한 발 물러나 붓끝을 잠시 지켜본다.',
        diary: '톈쯔팡에서 그림 그리는 화가의 붓끝을 잠시 지켜보았다.',
        effects: { tags: ['sight:tianzifang'] },
      },
    },
    {
      id: 'teahouse',
      text: '골목 찻집 이층에 앉아 쉰다',
      cost: 30,
      success: {
        text: '삐걱거리는 나무 계단을 올라 창가 자리에 앉는다. 아래로 골목을 오가는 사람들의 정수리가 보인다. 차 한 주전자를 다 비울 때쯤 다리가 풀린다.',
        diary: '톈쯔팡 골목 찻집 이층 창가에서 골목을 내려다보며 쉬었다.',
        effects: { tags: ['sight:tianzifang'], stamina: 15 },
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

import type { GameEvent } from '../../engine/types'
import { foodCheck, socialCheck, zhCheck } from './helpers'

export const E05: GameEvent = {
  id: 'E05',
  title: '샤오룽바오의 줄',
  location: 'yuyuan_bazaar',
  kind: 'destination',
  category: 'food',
  slots: [1, 2, 3],
  weight: 1.4,
  media: ['xiaolongbao-1', 'xiaolongbao-2', 'xiaolongbao-3', 'xiaolongbao-4'],
  facts: ['f_xiaolongbao'],
  teaser: '찜통 김이 자욱한 만두집 앞의 긴 줄',
  intro: [
    '예원 앞 상가의 오래된 만두집. 가게 앞 줄이 골목을 한 번 꺾어 돌아간다. 유리창 너머로 하얀 모자를 쓴 직원들이 쉴 새 없이 만두피에 주름을 잡는다.',
    '찜통 뚜껑이 열릴 때마다 김이 확 피어오른다. 얇은 피 안에서 국물이 출렁이는 게 보인다. 줄 옆에는 포장만 하는 작은 창구도 있다.',
  ],
  choices: [
    {
      id: 'queue',
      text: '줄을 서서 가게 안에서 제대로 먹는다',
      cost: 30,
      check: foodCheck(45),
      success: {
        media: 'xiaolongbao-2',
        text: '숟가락 위에 만두를 올리고, 젓가락 끝으로 피를 살짝 찢는다. 뜨거운 국물이 숟가락에 고인다. 후 불어 국물부터 마시고, 생강채를 얹은 흑식초에 찍어 한 입. 옆 테이블 할머니가 고개를 끄덕인다. 제대로 먹을 줄 안다는 뜻이다.',
        diary: '예원 앞 만두집에서 줄을 서 샤오룽바오를 먹었다. 숟가락에 올려 국물부터 마시는 법을 제대로 익혔다.',
        effects: { tags: ['food:xiaolongbao', 'culture:xiaolongbao_way', 'solve:soup_dumpling'], knowledge: ['f_xiaolongbao'], stamina: 10 },
      },
      failure: {
        media: 'xiaolongbao-2',
        text: '참지 못하고 통째로 입에 넣었다. 뜨거운 국물이 혀를 덮친다. 눈물이 찔끔 난다. 옆 테이블 할머니가 숟가락을 들어 보이며 시범을 보여 준다. 두 번째 만두부터는 성공이다.',
        diary: '샤오룽바오를 통째로 먹다 혀를 데었다. 옆자리 할머니가 숟가락으로 먹는 법을 보여 주었다.',
        effects: { tags: ['food:xiaolongbao'], knowledge: ['f_xiaolongbao'], stamina: 4 },
      },
    },
    {
      id: 'order',
      text: '중국어로 주문하며 추천을 묻는다',
      requires: [{ type: 'stat', stat: 'chinese', min: 2 }],
      cost: 30,
      check: zhCheck(35),
      success: {
        text: '“我要一笼小笼包，还有……你推荐什么？(샤오룽바오 한 판이요, 그리고… 뭘 추천하세요?)” 계산대 아주머니가 반색한다. 국물 맛이 진한 걸 원하면 이걸 먹으라며 메뉴를 짚어 주고, 식초 종지도 하나 더 얹어 준다.',
        diary: '만두집에서 중국어로 주문하고 추천을 물었다. 계산대 아주머니가 식초까지 챙겨 주었다.',
        effects: { tags: ['food:xiaolongbao', 'social:dumpling_aunt', 'solve:order_chinese'], knowledge: ['f_xiaolongbao'], count: ['zh'], stamina: 10 },
      },
      failure: {
        media: 'xiaolongbao-3',
        text: '추천을 묻는다는 게 무언가를 잘못 가리켰다. 나온 것은 노란 게살이 올라간 비싼 게살 샤오룽바오(蟹粉小笼). 지갑은 아프지만, 입 안은 행복하다.',
        diary: '중국어 주문이 꼬여 비싼 게살 샤오룽바오가 나왔다. 지갑은 아팠지만 맛은 최고였다.',
        effects: { tags: ['food:xiaolongbao', 'food:crab_xiaolongbao'], knowledge: ['f_xiaolongbao'], money: -25, count: ['zh-try'], stamina: 10 },
      },
    },
    {
      id: 'takeaway',
      text: '줄이 짧은 포장 창구에서 산다',
      cost: 15,
      success: {
        media: 'xiaolongbao-4',
        text: '종이 상자에 담긴 만두를 들고 연못가 난간에 기대어 먹는다. 식으면서 국물이 조금 줄었지만, 그래도 첫 입은 감탄이 나온다.',
        diary: '샤오룽바오를 포장해서 연못가에 서서 먹었다.',
        effects: { tags: ['food:xiaolongbao'], stamina: 6 },
      },
    },
    {
      id: 'skip',
      text: '줄이 너무 길다. 다음 기회에',
      success: {
        text: '줄 끝을 한번 보고 고개를 젓는다. 대신 가게 앞에서 김이 오르는 찜통 사진만 한 장 찍는다. 시간과 돈을 아꼈다.',
        diary: '샤오룽바오 가게의 줄이 너무 길어 사진만 찍고 지나쳤다.',
        effects: { knowledge: ['f_xiaolongbao'] },
      },
    },
  ],
}

export const E11: GameEvent = {
  id: 'E11',
  title: '황허루의 성젠바오',
  location: 'huanghe_road',
  kind: 'destination',
  category: 'food',
  weight: 1.2,
  media: ['huanghe-2', 'shengjian-1', 'shengjian-2', 'shengjian-3', 'huanghe-1'],
  facts: ['f_shengjian'],
  teaser: '무쇠 팬에서 지글거리는 군만두와 국수 골목',
  intro: [
    '인민광장 뒤편 황허루(黄河路) 먹자골목. 가게 앞 거대한 무쇠 팬 위에 동그란 만두 수십 개가 빼곡하다. 요리사가 팬을 빙글빙글 돌리며 물을 붓자 치이익 — 하얀 김이 솟는다.',
    '뚜껑을 열면 바닥은 노릇하게 지져지고 위에는 깨와 파가 솔솔 뿌려져 있다. 성젠바오(生煎包). 옆 가게에서는 파기름 냄새가 진동한다.',
  ],
  choices: [
    {
      id: 'eat',
      text: '줄 서서 성젠바오 한 접시를 먹는다',
      cost: 12,
      check: foodCheck(45),
      success: {
        media: 'shengjian-1',
        text: '먼저 위쪽을 살짝 깨물어 구멍을 낸다. 김이 빠져나가고, 국물을 조심스럽게 빨아들인다. 그다음 바삭한 바닥과 함께 한 입. 고소함과 육즙이 한꺼번에 밀려온다.',
        diary: '황허루에서 성젠바오를 먹었다. 위쪽에 구멍을 내고 국물을 먼저 마시니 바삭함과 육즙을 모두 즐길 수 있었다.',
        effects: { tags: ['food:shengjian'], knowledge: ['f_shengjian'], stamina: 10 },
      },
      failure: {
        media: 'shengjian-1',
        text: '덥석 깨물었다가 국물이 셔츠 앞섶으로 튄다. 옆 사람이 휴지를 건네며 웃는다. 얼룩은 남았지만, 맛은 기가 막히다.',
        diary: '성젠바오를 덥석 깨물다 국물이 셔츠에 튀었다. 얼룩도 여행의 기념품이다.',
        effects: { tags: ['food:shengjian'], knowledge: ['f_shengjian'], stamina: 8 },
      },
    },
    {
      id: 'boss',
      text: '팬을 돌리는 사장에게 비결을 묻는다',
      requires: [{ type: 'stat', stat: 'chinese', min: 2 }],
      cost: 12,
      check: socialCheck(30, [{ stat: 'chinese', per: 5 }]),
      success: {
        media: 'shengjian-2',
        text: '사장은 팬을 돌리던 손을 멈추지 않고 말한다. “火候！(불 조절이지!)” 바닥이 타기 직전에 물을 부어야 위는 찌고 아래는 지져진다고. 그리고 갓 나온 만두 하나를 덤으로 얹어 준다.',
        diary: '성젠바오 가게 사장에게 불 조절의 비결을 듣고, 덤으로 만두 하나를 더 받았다.',
        effects: { tags: ['food:shengjian', 'social:shengjian_boss'], knowledge: ['f_shengjian'], count: ['zh'], stamina: 12 },
      },
      failure: {
        media: 'shengjian-2',
        text: '사장은 너무 바쁘다. 대답 대신 접시를 내밀며 턱으로 빈자리를 가리킨다. 그래도 맛은 똑같이 좋다.',
        diary: '성젠바오 가게 사장에게 말을 걸었지만 너무 바빠 대답 대신 접시만 받았다.',
        effects: { tags: ['food:shengjian'], knowledge: ['f_shengjian'], stamina: 10 },
      },
    },
    {
      id: 'noodles',
      text: '옆 가게의 총유반몐을 먹는다',
      cost: 15,
      success: {
        media: 'huanghe-1',
        text: '파를 기름에 까맣게 될 때까지 볶아 간장과 함께 비빈 국수, 葱油拌面(cōngyóu bànmiàn). 단순한데 멈출 수가 없다. 그릇 바닥까지 긁어 먹는다.',
        diary: '황허루에서 파기름과 간장에 비빈 국수 총유반몐을 그릇 바닥까지 먹었다.',
        effects: { tags: ['food:scallion_noodles'], stamina: 12 },
      },
    },
    {
      id: 'watch',
      text: '먹지는 않고 팬 돌리는 모습만 구경한다',
      success: {
        media: 'shengjian-3',
        text: '팬을 돌리고, 물을 붓고, 뚜껑을 덮고, 기다리고. 리듬이 있다. 줄 선 사람들의 표정까지 구경하다 보니 이 골목의 저녁이 보인다.',
        diary: '황허루에서 성젠바오 굽는 모습을 한참 구경했다.',
        effects: { knowledge: ['f_shengjian'] },
      },
    },
  ],
}

export const E16: GameEvent = {
  id: 'E16',
  title: '상하이의 아침 식사',
  location: 'here',
  place: '골목 아침 노점',
  kind: 'destination',
  category: 'food',
  slots: [0],
  weight: 1.3,
  media: ['breakfast-1', 'breakfast-2', 'breakfast-3'],
  facts: ['f_breakfast'],
  teaser: '숙소 앞 골목, 유탸오와 더우장의 아침',
  intro: [
    '이른 아침, 숙소 앞 골목 어귀. 기름 솥에서 길쭉한 반죽이 부풀어 오르며 황금색 유탸오(油条)가 된다. 옆에서는 큰 솥의 더우장(豆浆)이 김을 뿜는다.',
    '출근길 사람들이 비닐봉지에 아침을 받아 들고 바쁘게 지나간다. 노점 아주머니의 손이 쉴 틈이 없다.',
  ],
  choices: [
    {
      id: 'set',
      text: '노점 메뉴를 하나씩 다 맛본다',
      cost: 10,
      success: {
        text: '다빙(大饼) 한 장, 유탸오 하나, 츠판(粢饭) 하나, 더우장 한 그릇. 줄 선 사람들이 하나같이 손에 든 것들이다. 작은 플라스틱 의자에 앉아 동네 사람들처럼 먹는다. 유탸오를 더우장에 적셔 먹는 게 이 골목의 방식인 것 같다.',
        diary: '골목 아침 노점에서 다빙, 유탸오, 츠판, 더우장을 하나씩 모두 맛보았다.',
        effects: { tags: ['food:breakfast_four'], knowledge: ['f_breakfast'], stamina: 14 },
      },
    },
    {
      id: 'cifan',
      text: '중국어로 츠판퇀을 주문한다',
      check: zhCheck(40),
      cost: 6,
      success: {
        media: 'breakfast-2',
        text: '“一个粢饭团，要咸的。(츠판퇀 하나, 짠 걸로요.)” 아주머니가 찹쌀밥을 펴고 유탸오와 고기 가루를 넣어 꾹꾹 뭉쳐 준다. “你中文讲得蛮好！(중국어 꽤 잘하네!)” 단골이 된 기분이다.',
        diary: '아침 노점에서 중국어로 짠 츠판퇀을 주문했다. 아주머니에게 중국어를 칭찬받았다.',
        effects: { tags: ['food:cifantuan', 'social:breakfast_auntie'], knowledge: ['f_breakfast'], count: ['zh'], stamina: 12 },
      },
      failure: {
        media: 'breakfast-2',
        text: '아주머니가 무언가를 되묻는다. 단 것? 짠 것? 얼떨결에 고개를 끄덕였더니 설탕이 듬뿍 든 츠판퇀이 나왔다. 아침부터 달콤하다.',
        diary: '츠판퇀을 주문하다 얼떨결에 설탕이 듬뿍 든 단 츠판퇀을 받았다.',
        effects: { tags: ['food:cifantuan'], knowledge: ['f_breakfast'], count: ['zh-try'], stamina: 10 },
      },
    },
    {
      id: 'salty',
      text: '짭짤한 셴더우장에 도전한다',
      cost: 6,
      check: foodCheck(40),
      success: {
        media: 'breakfast-3',
        text: '간장과 식초를 넣은 그릇에 뜨거운 두유를 부으면 몽글몽글 순두부처럼 엉긴다. 그 위에 새우 가루, 김, 유탸오 조각. 두유가 짜다니 — 그런데 맛있다. 숟가락이 멈추지 않는다.',
        diary: '두유에 간장과 식초를 넣어 몽글하게 엉긴 짠 두유 셴더우장에 도전했다. 의외로 맛있었다.',
        effects: { tags: ['food:salty_soymilk'], knowledge: ['f_breakfast'], stamina: 12 },
      },
      failure: {
        media: 'breakfast-3',
        text: '첫 숟가락에서 머릿속이 혼란스럽다. 두유인데 짜고 시다. 반쯤 먹고 달콤한 두유를 하나 더 시킨다. 경험은 경험이다.',
        diary: '짠 두유에 도전했지만 반쯤 먹고 단 두유로 바꿨다.',
        effects: { tags: ['food:salty_soymilk'], stamina: 6, money: -3 },
      },
    },
    {
      id: 'skip',
      text: '아침을 거르고 일찍 출발한다',
      success: {
        text: '기름 냄새를 뒤로하고 서둘러 걷는다. 이른 시간의 거리는 한산하다. 배는 조금 고프지만 하루를 먼저 시작한 기분이다.',
        diary: '아침을 거르고 일찍 하루를 시작했다.',
        effects: { stamina: -5 },
      },
    },
  ],
}

export const E23: GameEvent = {
  id: 'E23',
  title: '후신팅 찻집',
  location: 'yuyuan',
  kind: 'followup',
  category: 'culture',
  slots: [0, 1, 2],
  media: ['yuyuan-3'],
  facts: ['f_huxinting', 'f_tea'],
  intro: [
    '연못 위로 아홉 번 꺾인 다리 구곡교(九曲桥)를 건넌다. 그 끝, 물 한가운데 떠 있는 이층 누각이 후신팅(湖心亭) 찻집이다.',
    '나무 계단을 올라가자 창밖으로 연못과 예원의 지붕들이 내려다보인다. 탁자마다 작은 다과 접시와 찻주전자가 놓였다.',
  ],
  choices: [
    {
      id: 'tea',
      text: '녹차와 다과를 주문해 천천히 즐긴다',
      cost: 50,
      success: {
        text: '유리잔 속에서 찻잎이 천천히 몸을 편다. 작은 접시에는 메추리알과 말린 두부, 달콤한 콩과자. 직원이 긴 주둥이 주전자로 멀리서 물을 따르는 묘기를 보여 준다. 차 한 잔에 이렇게 많은 이야기가 담겼다.',
        diary: '예원 연못 위 후신팅 찻집에서 녹차와 다과를 즐겼다. 긴 주둥이 주전자로 물을 따르는 묘기도 보았다.',
        effects: { tags: ['culture:tea', 'food:tea_snacks'], knowledge: ['f_tea', 'f_huxinting'], addItems: ['tea_leaves'], stamina: 20 },
      },
    },
    {
      id: 'talk',
      text: '옆자리 단골 손님과 이야기를 나눈다',
      check: socialCheck(35),
      success: {
        text: '신문을 읽던 할아버지가 이 찻집에 50년째 온다고 한다. 예전엔 다리 위에서 장기를 두던 사람이 많았다고. 할아버지가 자기 찻주전자의 차를 한 잔 따라 준다.',
        diary: '후신팅 찻집에서 50년째 단골이라는 할아버지와 이야기를 나누고 차 한 잔을 얻어 마셨다.',
        effects: { tags: ['culture:tea', 'social:park_chat'], knowledge: ['f_huxinting'], count: ['zh'], stamina: 15 },
      },
      failure: {
        text: '할아버지는 신문에서 눈을 떼지 않는다. 대신 창밖 연못의 잉어를 세며 차를 마신다.',
        diary: '후신팅 찻집에서 창밖 연못의 잉어를 세며 차를 마셨다.',
        effects: { tags: ['culture:tea'], knowledge: ['f_huxinting'], stamina: 15 },
      },
    },
    {
      id: 'bridge',
      text: '차는 마시지 않고 다리 위에서 사진만 찍는다',
      success: {
        text: '지그재그로 꺾인 다리 위에서 누각을 배경으로 사진을 찍는다. 다리가 왜 이렇게 꺾였을까. 연못을 천천히 더 오래 보라는 뜻이라고 생각하기로 한다.',
        diary: '구곡교 위에서 후신팅 찻집을 배경으로 사진을 찍었다.',
        effects: { knowledge: ['f_huxinting'] },
      },
    },
  ],
}

export const E24: GameEvent = {
  id: 'E24',
  title: '상하이 가정집의 저녁',
  location: 'here',
  place: '친구네 스쿠먼 집',
  kind: 'followup',
  category: 'food',
  slots: [3],
  media: ['lilong-3', 'lilong-1'],
  facts: ['f_benbang', 'f_shikumen'],
  intro: [
    '공원에서 만난 친구에게서 메시지가 온다. “오늘 저녁 우리 집에서 밥 먹어요. 엄마가 훙사오러우 했어요.”',
    '좁은 룽탕 안쪽, 돌 문틀의 검은 대문을 열자 간장과 설탕이 졸아드는 냄새가 쏟아진다. 둥근 식탁에 접시가 빼곡하다. 친구의 어머니가 앞치마를 두른 채 손짓한다. “来来来，坐！(어서 와, 앉아!)”',
  ],
  choices: [
    {
      id: 'eat',
      text: '어머니가 권하는 대로 한 그릇 더 먹는다',
      success: {
        text: '윤기가 흐르는 붉은 삼겹살 훙사오러우(红烧肉). 젓가락만 대도 무너진다. 달고 짭조름한 국물을 밥에 비벼 먹는다. 친구가 웃으며 말한다. 이게 상하이 집밥, 본방차이(本帮菜)의 맛이라고. 어머니는 내 그릇이 비기가 무섭게 또 채워 준다.',
        diary: '공원에서 만난 친구의 스쿠먼 집에 초대받아 어머니가 만든 훙사오러우를 먹었다. 그릇이 비기 무섭게 다시 채워졌다.',
        effects: { tags: ['food:hongshaorou', 'culture:benbang', 'social:home_dinner'], knowledge: ['f_benbang'], stamina: 25 },
      },
    },
    {
      id: 'toast',
      text: '중국어로 감사의 건배사를 한다',
      check: zhCheck(35, [{ stat: 'social', per: 5 }]),
      success: {
        text: '잔을 들고 일어선다. “谢谢阿姨，菜太好吃了！祝你们身体健康！(어머니, 정말 맛있어요! 모두 건강하세요!)” 식탁에 박수가 터진다. 어머니가 눈가를 훔치며 웃는다.',
        diary: '친구네 저녁 식탁에서 중국어로 감사의 건배사를 했다. 박수가 터졌고 어머니가 웃었다.',
        effects: { tags: ['food:hongshaorou', 'social:home_dinner', 'culture:benbang'], knowledge: ['f_benbang'], count: ['zh'], stats: { social: 1 }, stamina: 25 },
      },
      failure: {
        text: '“谢谢”까지는 잘 나왔는데 그다음이 막힌다. 친구가 대신 마무리해 주고, 모두가 잔을 부딪친다. 마음은 전해졌다.',
        diary: '친구네 저녁 식탁에서 서툰 중국어로 감사 인사를 했다. 친구가 마무리를 도와주었다.',
        effects: { tags: ['food:hongshaorou', 'social:home_dinner'], knowledge: ['f_benbang'], stamina: 25 },
      },
    },
    {
      id: 'gift',
      text: '가져온 선물을 건네고 부엌일을 돕는다',
      requires: [{ type: 'any', of: [{ type: 'item', item: 'ligaotang' }, { type: 'item', item: 'tea_leaves' }, { type: 'item', item: 'paper_cut' }] }],
      success: {
        text: '여행 중에 산 선물을 내밀자 어머니가 손사래를 치다 결국 받아 든다. 설거지를 돕겠다고 부엌에 들어가니 좁은 스쿠먼 부엌에 세 사람이 어깨를 부딪치며 웃는다. 이 집의 일부가 된 것 같다.',
        diary: '친구네 집에 여행 중 산 선물을 드리고 좁은 스쿠먼 부엌에서 설거지를 도왔다.',
        effects: { tags: ['food:hongshaorou', 'social:home_dinner', 'culture:lilong_life'], knowledge: ['f_shikumen'], stats: { social: 1 }, stamina: 20 },
      },
    },
  ],
}

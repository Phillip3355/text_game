import type { GameEvent } from '../../engine/types'
import { cultureCheck, lookCheck, zhCheck } from './helpers'

// 고정 사건(도착·마지막), 휴식, 폴백

export const E01: GameEvent = {
  id: 'E01',
  title: '상하이 도착',
  location: 'pudong_airport',
  kind: 'fixed',
  category: 'transport',
  endLocation: { location: 'peoples_square', note: '인민광장 근처 숙소에 짐을 풀었다. 여기서부터 상하이 여행이 시작된다.' },
  video: 'video-maglev',
  media: ['airport-1', 'airport-2', 'airport-3'],
  facts: ['f_maglev', 'f_mandarin'],
  intro: [
    '입국 심사대를 빠져나오자 유리 천장 너머로 흐린 하늘이 보인다. 푸둥 국제공항(浦东国际机场). 안내판에는 한자와 영어가 나란히 적혀 있고, 사방에서 빠른 중국어가 쏟아진다.',
    '시내까지는 꽤 멀다. 자기부상열차(磁浮), 지하철 2호선, 택시 승강장을 가리키는 화살표가 갈래갈래 뻗어 있다. 안내 데스크의 직원이 이쪽을 보며 고개를 살짝 기울인다.',
    '사흘. 이 도시에 주어진 시간이다. 첫 걸음을 어떻게 뗄까.',
  ],
  choices: [
    {
      id: 'ask',
      text: '안내 데스크에 중국어로 길을 묻는다',
      check: zhCheck(35),
      success: {
        text: '“你好，请问去市区怎么走？(Nǐ hǎo, qǐngwèn qù shìqū zěnme zǒu? — 시내에 어떻게 가나요?)”\n\n직원은 천천히, 또박또박 대답해 준다. 교통카드는 저쪽 창구에서 사면 되고, 지하철 2호선을 타면 난징루까지 한 번에 간다고. 마지막엔 엄지를 들어 보인다. “你的中文不错！(중국어 잘하네요!)”',
        diary: '공항 안내 데스크에서 처음으로 중국어로 길을 물었고, 친절한 설명 덕분에 교통카드를 사서 무사히 시내로 들어왔다.',
        effects: {
          addItems: ['transit_card'],
          tags: ['solve:arrival'],
          knowledge: ['f_mandarin', 'f_metro'],
          count: ['zh'],
          stats: { chinese: 1 },
          stamina: -6,
        },
      },
      failure: {
        text: '준비한 문장이 입 안에서 엉킨다. 직원은 미소를 잃지 않고 영어와 손짓을 섞어 지하철 쪽을 가리킨다. 결국 교통카드 창구까지 직원이 함께 걸어가 주었다.\n\n조금 민망하지만, 첫날부터 사람의 친절을 배웠다.',
        diary: '공항에서 중국어로 길을 물으려다 말이 막혔지만, 직원이 교통카드 창구까지 데려다주었다.',
        effects: { addItems: ['transit_card'], knowledge: ['f_mandarin'], count: ['zh-try'], stamina: -8 },
      },
    },
    {
      id: 'maglev',
      text: '자기부상열차를 타 본다',
      cost: 50,
      success: {
        media: 'airport-2',
        text: '열차가 미끄러지듯 출발한다. 덜컹거림이 없다. 객차 앞쪽의 속도계 숫자가 무서운 속도로 올라가고, 창밖의 논과 공장이 선처럼 늘어진다.\n\n눈 깜짝할 사이에 룽양루(龙阳路)역. 시내로 들어가는 지하철로 갈아타며 교통카드도 하나 샀다.',
        diary: '공항에서 자기부상열차를 타고 순식간에 시내로 들어왔다. 속도계의 숫자가 아직도 눈에 선하다.',
        effects: { tags: ['sight:maglev'], knowledge: ['f_maglev'], addItems: ['transit_card'], stamina: -2 },
      },
    },
    {
      id: 'map',
      text: '종이 지도를 펼쳐 노선을 직접 짠다',
      requires: [{ type: 'item', item: 'paper_map' }],
      check: lookCheck(45),
      success: {
        text: '지도 위에 손가락으로 선을 긋는다. 2호선으로 곧장 가다가 인민광장(人民广场)에서 갈아타면 숙소까지 걸어서 십 분. 표지판의 색깔과 노선 번호가 지도와 딱 맞아떨어진다.\n\n누구에게도 묻지 않고 숙소 문 앞에 섰을 때, 이 도시가 조금 만만해 보였다.',
        diary: '종이 지도로 직접 노선을 짜서 공항에서 숙소까지 혼자 찾아갔다.',
        effects: { tags: ['solve:arrival'], addItems: ['transit_card'], knowledge: ['f_metro'], count: ['nav'], stamina: -8 },
      },
      failure: {
        text: '지도와 실제 출구 번호가 맞지 않는다. 한 정거장을 지나쳐 되돌아오느라 삼십 분을 썼다. 그래도 덕분에 지하철 노선만큼은 머리에 들어왔다.',
        diary: '종이 지도만 믿고 가다 한 정거장을 지나쳤지만, 덕분에 지하철 노선을 익혔다.',
        effects: { addItems: ['transit_card'], knowledge: ['f_metro'], stamina: -14 },
      },
    },
    {
      id: 'app',
      text: '번역 앱을 켜고 지하철 2호선을 탄다',
      success: {
        text: '화면에 대고 또박또박 말하자 앱이 “去市区的地铁在哪里？”라고 읽어 준다. 청소하던 직원이 손가락으로 아래층을 가리킨다.\n\n교통카드를 사고, 긴 2호선 열차에 몸을 싣는다. 창밖으로 공항 주변의 풍경이 천천히 도시로 바뀐다.',
        diary: '번역 앱의 도움으로 교통카드를 사고 지하철 2호선을 타고 시내로 들어왔다.',
        effects: { addItems: ['transit_card'], knowledge: ['f_metro'], stamina: -10, money: -7 },
      },
    },
  ],
}

export const E20: GameEvent = {
  id: 'E20',
  title: '마지막 여행의 선택',
  location: 'waibaidu',
  kind: 'fixed',
  category: 'special',
  media: ['waibaidu-1', 'waibaidu-2', 'waibaidu-3'],
  facts: ['f_waibaidu'],
  variants: [
    {
      when: [{ type: 'item', item: 'friend_contact' }],
      text: ['주머니 속 휴대폰이 짧게 울린다. 공원에서 만난 친구의 메시지다. “내일 떠나요? 잘 가요, 또 와요.”'],
    },
    {
      when: [{ type: 'stamina', min: 0 }, { type: 'tagCount', prefix: 'food:', min: 3 }],
      text: ['배는 부르지만 마음은 허전하다. 사흘 동안 먹은 것들의 이름을 손가락으로 꼽아 본다.'],
    },
  ],
  intro: [
    '사흘째 저녁. 쑤저우허가 황푸강과 만나는 어귀, 철골 아치의 와이바이두교(外白渡桥) 위에 선다. 백 년도 더 된 다리 아래로 물이 느릿느릿 흘러간다.',
    '남쪽으로는 와이탄의 석조 건물들에 하나둘 불이 켜지고, 강 건너 푸둥의 유리 탑들이 그 빛을 받아 되비춘다. 내일 아침이면 공항으로 간다.',
    '이 도시에서의 마지막 저녁을 어떻게 보낼까.',
  ],
  choices: [
    {
      id: 'friend',
      text: '현지 친구에게 중국어로 작별 메시지를 보낸다',
      requires: [{ type: 'item', item: 'friend_contact' }],
      check: zhCheck(55),
      success: {
        text: '한 글자 한 글자 눌러 쓴다. “谢谢你。我会想念上海的。(고마워요. 상하이가 그리울 거예요.)”\n\n곧 답장이 온다. 음성 메시지다. 상하이 말 억양이 섞인 목소리가 웃으며 말한다. “一路顺风！(가는 길 평안하길!)”',
        diary: '마지막 밤, 공원에서 만난 친구에게 중국어로 작별 인사를 보냈고 “一路顺风”이라는 답을 받았다.',
        effects: { tags: ['social:farewell'], count: ['zh'] },
      },
      failure: {
        text: '몇 번을 고쳐 쓰다 결국 번역 앱의 문장을 붙여 넣는다. 그래도 친구는 하트 이모티콘과 함께 답한다. “下次再来！(다음에 또 와요!)”',
        diary: '마지막 밤, 서툰 중국어 대신 번역 앱으로 친구에게 인사를 보냈다. “다음에 또 와요”라는 답이 왔다.',
        effects: { tags: ['social:farewell'] },
      },
    },
    {
      id: 'dinner',
      text: '강변 골목에서 마지막 저녁을 먹는다',
      cost: 40,
      success: {
        media: 'waibaidu-3',
        text: '다리 근처 작은 식당. 메뉴판을 손가락으로 짚어 가며 이것저것 시킨다. 달고 짭조름한 간장 양념, 김이 오르는 국물. 옆자리 가족이 건배를 한다.\n\n첫날보다 훨씬 자연스럽게 젓가락이 움직인다.',
        diary: '마지막 저녁은 와이바이두교 근처 작은 식당에서 먹었다. 첫날보다 훨씬 자연스럽게 주문했다.',
        effects: { tags: ['food:farewell_dinner'], stamina: 10 },
      },
    },
    {
      id: 'reflect',
      text: '다리 난간에 기대어 여행 노트를 정리한다',
      requires: [{ type: 'stat', stat: 'culture', min: 2 }],
      check: cultureCheck(50),
      success: {
        text: '명나라의 정원, 조계 시대의 은행 건물, 개혁개방 뒤 솟은 탑. 노트에 적어 둔 것들이 하나의 연표로 이어진다.\n\n“이 다리가 놓인 것은 1907년.” 마지막 줄을 적고 펜을 닫는다. 이 도시의 시간이 조금은 내 안에도 쌓였다.',
        diary: '와이바이두교 위에서 여행 노트를 정리했다. 흩어져 있던 지식이 한 줄의 역사로 이어졌다.',
        effects: { tags: ['culture:reflection'], knowledge: ['f_waibaidu'] },
      },
      failure: {
        text: '적어 둔 메모가 뒤죽박죽이다. 어느 건물이 몇 년에 지어졌더라. 그래도 괜찮다. 기억나지 않는 것은 다음에 다시 와서 확인하면 된다.',
        diary: '와이바이두교 위에서 여행 노트를 정리하려 했지만, 뒤죽박죽인 메모가 오히려 웃음을 줬다.',
        effects: { knowledge: ['f_waibaidu'] },
      },
    },
    {
      id: 'quiet',
      text: '아무것도 하지 않고 강을 바라본다',
      success: {
        text: '카메라도 휴대폰도 주머니에 넣는다. 유람선이 긴 빛의 꼬리를 끌며 지나가고, 다리 위로 자전거 벨 소리가 흩어진다.\n\n사진에는 남지 않을 저녁이지만, 오래 기억에 남을 것 같다.',
        diary: '마지막 저녁, 와이바이두교 위에서 아무것도 하지 않고 한참 동안 강을 바라보았다.',
        effects: { tags: ['sight:waibaidu'], stamina: 5 },
      },
    },
  ],
}

export const E21: GameEvent = {
  id: 'E21',
  title: '잠깐의 쉼표',
  location: 'here',
  place: '숙소와 근처 찻집',
  kind: 'rest',
  category: 'rest',
  media: ['streets-1'],
  facts: ['f_tea'],
  intro: [
    '다리가 천근이다. 계단 하나 오르는 것도 버겁다. 무리하면 남은 여행을 다 망칠지도 모른다.',
    '숙소 근처 골목에는 오래된 찻집과 작은 발 마사지 가게가 있다. 아니면 그냥 숙소 침대에 몸을 던져도 된다.',
  ],
  choices: [
    {
      id: 'nap',
      text: '숙소로 돌아가 낮잠을 잔다',
      success: {
        text: '커튼을 치고 눈을 감는다. 창밖에서 자전거 벨과 경적이 아득히 섞인다. 눈을 떴을 때 몸이 한결 가볍다.',
        diary: '지쳐서 숙소로 돌아가 한숨 푹 잤다.',
        effects: { stamina: 35 },
      },
    },
    {
      id: 'tea',
      text: '찻집에서 녹차 한 잔을 천천히 마신다',
      cost: 20,
      success: {
        text: '유리잔에 납작한 찻잎을 넣고 뜨거운 물을 붓는다. 찻잎이 천천히 몸을 펴며 가라앉는다. 주인은 물이 줄어들 때마다 말없이 보온병의 물을 채워 준다.\n\n한 시간쯤 지나자 다리의 열기가 빠져나간 것 같다.',
        diary: '찻집에서 유리잔 속 찻잎이 피어나는 걸 보며 녹차를 마시고 쉬었다.',
        effects: { stamina: 30, tags: ['culture:tea'], knowledge: ['f_tea'] },
      },
    },
    {
      id: 'massage',
      text: '발 마사지 가게에 들어간다',
      cost: 60,
      success: {
        text: '뜨거운 약초 물에 발을 담그자 저절로 한숨이 나온다. 마사지사가 발바닥의 한 점을 누르며 “累了吧？(피곤하죠?)” 하고 웃는다.\n\n가게를 나설 때는 새 신발을 신은 것처럼 발걸음이 가볍다.',
        diary: '발 마사지를 받고 새 신발을 신은 것처럼 가벼워졌다.',
        effects: { stamina: 55 },
      },
    },
  ],
}

export const E22: GameEvent = {
  id: 'E22',
  title: '플라타너스 길 산책',
  location: 'here',
  place: '가로수 길',
  kind: 'fallback',
  category: 'sight',
  video: 'video-street',
  media: ['streets-1', 'streets-3'],
  intro: [
    '딱히 정해 둔 곳이 없는 시간. 넓은 잎의 플라타너스(梧桐)가 터널처럼 드리운 길을 따라 걷는다.',
    '자전거를 탄 배달원이 지나가고, 담장 너머로 누군가 기르는 새장 속 새가 운다. 계획에 없던 시간이 오히려 여행 같다.',
  ],
  choices: [
    {
      id: 'watch',
      text: '벤치에 앉아 거리를 구경한다',
      success: {
        text: '장바구니를 든 할머니, 교복 입은 학생들, 강아지를 안고 통화하는 젊은이. 각자의 하루가 눈앞을 지나간다. 관광지에서는 보이지 않던 상하이다.',
        diary: '플라타너스 길 벤치에 앉아 상하이 사람들의 평범한 하루를 구경했다.',
        effects: { tags: ['culture:street_life'], stamina: 5 },
      },
    },
    {
      id: 'snack',
      text: '편의점에서 간식을 사 먹는다',
      cost: 8,
      success: {
        text: '편의점 계산대 옆 전기솥에서 차예단(茶叶蛋)이 간장과 찻잎 향을 풍기며 끓고 있다. 하나를 집어 들고 걸으며 까먹는다.',
        diary: '편의점에서 찻잎에 삶은 달걀을 사서 걸으며 먹었다.',
        effects: { stamina: 10 },
      },
    },
    {
      id: 'wander',
      text: '발길 닿는 대로 골목에 들어가 본다',
      check: lookCheck(30),
      success: {
        text: '큰길에서 한 블록 들어가자 소음이 거짓말처럼 사라진다. 오래된 아파트 발코니마다 화분이 넘쳐흐르고, 할아버지 둘이 바둑판 앞에서 꼼짝도 안 한다.',
        diary: '큰길에서 한 블록 들어간 조용한 골목에서 바둑 두는 할아버지들을 만났다.',
        effects: { tags: ['culture:street_life'], stats: { observation: 1 }, stamina: -5 },
      },
      failure: {
        text: '걷다 보니 같은 교차로로 돌아와 있다. 다리만 아프다. 그래도 길 이름 몇 개는 외웠다.',
        diary: '발길 닿는 대로 걸었다가 같은 교차로로 되돌아왔다.',
        effects: { stamina: -8 },
      },
    },
  ],
}

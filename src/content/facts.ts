import type { Fact } from '../engine/types'

// 관광·문화 정보 카드. 게임 속 인물·대사는 허구이지만 이 카드의 내용은
// 아래 출처에서 확인할 수 있는 사실만 담는다. 가격·운영시간 같은 변동 정보는 넣지 않는다.

const wiki = (title: string, lang: 'en' | 'ko' | 'zh' = 'en') => ({
  label: `Wikipedia (${lang}) — ${decodeURIComponent(title).replace(/_/g, ' ')}`,
  url: `https://${lang}.wikipedia.org/wiki/${title}`,
})

const list: Fact[] = [
  {
    id: 'f_maglev',
    title: '상하이 자기부상열차',
    body: '푸둥 국제공항과 시내 쪽 룽양루(龙阳路)역을 잇는 자기부상열차(上海磁浮)는 2004년부터 정식 상업 운행을 시작했다. 바퀴 대신 자기력으로 떠서 달리는 고속 열차로, 약 30km 구간을 수 분 만에 주파한다.',
    sources: [wiki('Shanghai_maglev_train')],
  },
  {
    id: 'f_metro',
    title: '상하이 지하철',
    body: '상하이 지하철(上海地铁)은 1993년 1호선의 첫 구간 개통으로 시작해, 지금은 노선 길이로 세계에서 가장 큰 도시철도망 가운데 하나가 되었다. 인민광장역은 여러 노선이 만나는 대표적인 환승역이다. 요금은 이동 거리에 따라 달라진다.',
    sources: [wiki('Shanghai_Metro')],
  },
  {
    id: 'f_bund',
    title: '와이탄 — 만국건축박람군',
    body: '와이탄(外滩)은 황푸강 서쪽 강변을 따라 이어진 거리다. 19세기 후반부터 20세기 초에 걸쳐 외국 은행과 무역회사들이 지은 고딕·바로크·신고전주의·아르데코 양식의 건물이 늘어서 있어 ‘만국건축박람군(万国建筑博览群)’이라 불린다. 시계탑이 있는 옛 세관 건물(1927)과 녹색 피라미드 지붕의 화평반점 북관(옛 사순 하우스, 1929)이 대표적이다.',
    sources: [wiki('The_Bund'), wiki('Custom_House,_Shanghai'), wiki('Peace_Hotel')],
  },
  {
    id: 'f_huangpu',
    title: '황푸강',
    body: '황푸강(黄浦江)은 상하이 시내를 가로질러 북쪽의 우쑹커우에서 양쯔강 하구로 흘러든다. 강을 경계로 서쪽의 옛 시가지를 푸시(浦西), 동쪽의 신시가지를 푸둥(浦东)이라 부른다. 시민들은 지금도 페리를 타고 강을 건넌다.',
    sources: [wiki('Huangpu_River')],
  },
  {
    id: 'f_waibaidu',
    title: '와이바이두교',
    body: '와이바이두교(外白渡桥, Garden Bridge)는 쑤저우허(苏州河)가 황푸강과 만나는 어귀에 놓인 철제 트러스 다리로, 1907년에 완공되었다. 와이탄 북쪽 끝의 상징적인 풍경이다.',
    sources: [wiki('Waibaidu_Bridge')],
  },
  {
    id: 'f_nanjing_road',
    title: '난징루',
    body: '난징루(南京路)는 와이탄에서 서쪽으로 뻗은 상하이의 대표 상업 거리로, 세계에서 가장 붐비는 쇼핑 거리 가운데 하나로 꼽힌다. 길을 따라 오래된 백화점과 상점이 늘어서 있고, 와이탄 쪽 동쪽 구간은 보행자 거리로 꾸며졌다.',
    sources: [wiki('Nanjing_Road')],
  },
  {
    id: 'f_yuyuan',
    title: '예원',
    body: '예원(豫园)은 명나라 때인 1559년, 관리 판윈돤(潘允端)이 부모의 노후를 위해 짓기 시작한 정원이다. 이름의 ‘豫’에는 평안과 기쁨이라는 뜻이 담겼다. 가산(假山)과 연못, 회랑이 겹겹이 이어지고, 구멍이 숭숭 뚫린 태호석 ‘옥영롱(玉玲珑)’이 유명하다.',
    sources: [wiki('Yu_Garden')],
  },
  {
    id: 'f_huxinting',
    title: '후신팅 찻집과 구곡교',
    body: '예원 바깥 연못 한가운데에 있는 후신팅(湖心亭)은 상하이에서 가장 오래된 찻집 가운데 하나로 꼽힌다. 연못을 지그재그로 건너는 구곡교(九曲桥)로 이어진다.',
    sources: [wiki('Yu_Garden')],
  },
  {
    id: 'f_xiaolongbao',
    title: '샤오룽바오',
    body: '샤오룽바오(小笼包)는 작은 대나무 찜통(小笼)에 쪄 내는 만두로, 상하이 교외 난샹(南翔)에서 유래했다고 알려져 있다. 소에 섞은 고기 젤리가 찌는 동안 녹아 국물이 된다. 숟가락에 올려 피를 살짝 터뜨려 국물을 먼저 마시고, 생강채와 흑식초를 곁들여 먹는다.',
    sources: [wiki('Xiaolongbao')],
  },
  {
    id: 'f_shengjian',
    title: '성젠바오',
    body: '성젠바오(生煎包)는 상하이 사람들이 아침이나 간식으로 즐겨 먹는 군만두다. 큰 무쇠 팬에 촘촘히 놓고 바닥은 기름에 바삭하게 지지면서 물을 부어 위쪽은 쪄 낸다. 깨와 파를 뿌려 마무리하며, 속에는 육즙이 들어 있다.',
    sources: [wiki('Shengjian_mantou')],
  },
  {
    id: 'f_breakfast',
    title: '유탸오와 츠판퇀',
    body: '유탸오(油条)는 길쭉하게 튀긴 밀가루 반죽으로, 두유(豆浆)와 함께 먹는 중국의 대표적인 아침 음식이다. 상하이를 비롯한 강남 지역에서는 찹쌀밥으로 유탸오를 감싸 주먹밥처럼 뭉친 츠판퇀(粢饭团)도 흔한 아침 메뉴다.',
    sources: [wiki('Youtiao'), wiki('Cifantuan')],
  },
  {
    id: 'f_benbang',
    title: '본방차이와 훙사오러우',
    body: '상하이 토박이 요리를 본방차이(本帮菜)라고 한다. 간장과 설탕을 넉넉히 써 달고 짭조름하게 졸이는 ‘농유적장(浓油赤酱)’이 특징이며, 삼겹살을 붉게 졸인 훙사오러우(红烧肉)가 대표 요리다.',
    sources: [wiki('Shanghai_cuisine'), wiki('Red_braised_pork_belly')],
  },
  {
    id: 'f_lujiazui',
    title: '루자쭈이와 푸둥 개발',
    body: '1990년 중국 정부가 푸둥의 개발·개방을 결정한 뒤, 강 건너 농지와 창고 지대였던 루자쭈이(陆家嘴)는 금융 지구로 바뀌었다. 진마오 타워(420.5m), 상하이 세계금융센터(492m), 2015년 완공된 상하이 타워(632m)가 나란히 서 있다. 상하이 타워는 중국에서 가장 높은 건물이다.',
    sources: [wiki('Lujiazui'), wiki('Shanghai_Tower')],
  },
  {
    id: 'f_oriental_pearl',
    title: '동방명주 탑',
    body: '동방명주(东方明珠) 방송탑은 1994년에 완공된 높이 468m의 탑이다. 크고 작은 구슬을 꿴 듯한 모양은 당나라 시인 백거이의 시 「비파행」의 한 구절 ‘큰 구슬 작은 구슬이 옥 쟁반에 떨어지네(大珠小珠落玉盘)’에서 영감을 얻었다고 알려져 있다.',
    sources: [wiki('Oriental_Pearl_Tower')],
  },
  {
    id: 'f_museum',
    title: '상하이 박물관',
    body: '상하이 박물관은 1952년에 문을 열었고, 1996년 인민광장의 지금 건물로 옮겼다. 둥근 지붕과 네모난 기단은 ‘하늘은 둥글고 땅은 네모나다(天圆地方)’는 옛 사상을 담았으며, 건물 전체가 고대 청동 솥인 정(鼎)을 닮았다. 청동기·도자기·서화 소장품으로 이름 높다.',
    sources: [wiki('Shanghai_Museum')],
  },
  {
    id: 'f_peoples_square',
    title: '인민광장',
    body: '인민광장(人民广场)은 상하이 도심 한가운데, 황푸구에 있는 큰 광장이다. 둥근 지붕의 상하이 박물관이 이 광장에 있다.',
    sources: [wiki("People's_Square"), wiki('Shanghai_Museum')],
  },
  {
    id: 'f_shikumen',
    title: '스쿠먼',
    body: '스쿠먼(石库门)은 19세기 후반 상하이에서 생겨난 주택 양식이다. 돌로 짠 문틀에 검은 나무 대문을 단 2~3층 집들이 줄지어 서 있고, 그 사이 골목을 룽탕(弄堂) 또는 리룽(里弄)이라 부른다. 서양식 연립주택과 강남 전통 가옥의 구조가 섞여 있다.',
    sources: [wiki('Shikumen')],
  },
  {
    id: 'f_xintiandi',
    title: '신톈디',
    body: '신톈디(新天地)는 옛 스쿠먼 골목을 보존·재생해 식당과 상점 거리로 만든 곳이다. 1921년 중국공산당 제1차 전국대표대회가 시작된 곳도 바로 이 근처의 스쿠먼 건물로, 지금은 기념관으로 남아 있다.',
    sources: [wiki('Xintiandi'), wiki('1st_National_Congress_of_the_Chinese_Communist_Party')],
  },
  {
    id: 'f_tianzifang',
    title: '톈쯔팡',
    body: '톈쯔팡(田子坊)은 타이캉루(泰康路) 일대의 스쿠먼 골목이다. 1990년대 후반부터 예술가들이 빈 공장과 창고에 작업실을 열면서 공방과 갤러리, 카페가 모인 골목 예술 거리로 바뀌었다. 지금도 일부 집에는 주민이 산다.',
    sources: [wiki('Tianzifang')],
  },
  {
    id: 'f_wukang',
    title: '우캉루와 우캉 맨션',
    body: '우캉루(武康路)는 옛 프랑스 조계 지역의 플라타너스 가로수 길이다. 길 끝의 우캉 맨션(武康大楼, 옛 노르망디 아파트)은 헝가리 출신 건축가 라슬로 후데크가 설계해 1924년 완공했으며, 뱃머리처럼 뾰족한 모양으로 유명하다. 거리 곳곳의 옛 저택에는 작가 바진(巴金)의 옛집처럼 역사 인물의 표지판이 붙어 있다.',
    sources: [wiki('Wukang_Mansion'), wiki('Wukang_Road'), wiki('László_Hudec')],
  },
  {
    id: 'f_fuxing_park',
    title: '푸싱 공원',
    body: '푸싱 공원(复兴公园)은 옛 프랑스 조계 시절에 만들어진 공원으로, 대칭으로 다듬은 화단 같은 프랑스식 정원의 흔적이 남아 있다. 아침이면 태극권과 춤, 카드놀이를 즐기는 시민들로 붐빈다.',
    sources: [wiki('Fuxing_Park')],
  },
  {
    id: 'f_zhujiajiao',
    title: '주자자오',
    body: '주자자오(朱家角)는 상하이 서쪽 칭푸구의 수향(水乡) 마을로, 약 1,700년 전부터 사람이 모여 살았다고 전해진다. 운하를 따라 옛 집들이 늘어서 있고, 돌다리 방생교(放生桥)가 마을의 대표 명소다. ‘방생(放生)’은 잡힌 물고기 같은 생명을 놓아 준다는 뜻이다.',
    sources: [wiki('Zhujiajiao')],
  },
  {
    id: 'f_lilong',
    title: '리룽의 생활',
    body: '리룽(里弄)·룽탕(弄堂)은 스쿠먼 같은 연립주택 사이로 난 골목이다. 대문을 열면 바로 이웃이 보이는 구조여서, 골목 자체가 빨래를 말리고 아이들이 놀고 이웃이 이야기를 나누는 공동의 마당 구실을 했다.',
    sources: [wiki('Shikumen'), wiki('Lilong,_Shanghai')],
  },
  {
    id: 'f_shanghainese',
    title: '상하이 말',
    body: '상하이 사람들끼리는 표준 중국어(普通话)와 함께 상하이 말(上海话)을 쓴다. 상하이 말은 오어(吴语)에 속하며 발음이 표준어와 꽤 다르다. 인사말 ‘안녕하세요’는 표준어로 니하오(你好)지만 상하이 말로는 ‘농호(侬好)’에 가깝게 들린다.',
    sources: [wiki('Shanghainese')],
  },
  {
    id: 'f_tea',
    title: '중국 차 한 잔',
    body: '중국에서는 찻잎을 우리는 방식과 차의 종류가 지역마다 다양하다. 상하이와 가까운 저장성 항저우의 룽징(龙井)은 대표적인 녹차로, 납작하게 덖은 잎을 유리잔에 넣고 뜨거운 물을 부어 잎이 피어나는 모습을 보며 마시기도 한다.',
    sources: [wiki('Longjing_tea')],
  },
  {
    id: 'f_peace_jazz',
    title: '화평반점의 올드 재즈',
    body: '와이탄의 화평반점(和平饭店, 옛 캐세이 호텔)은 1929년에 지어진 아르데코 건물이다. 이 호텔의 재즈 바에서는 오랫동안 노년 연주자들로 이루어진 재즈 밴드가 옛 상하이의 재즈를 연주해 이름을 알렸다.',
    sources: [wiki('Peace_Hotel')],
  },
  {
    id: 'f_mandarin',
    title: '여행 중국어 몇 마디',
    body: '니하오(你好 nǐ hǎo) 안녕하세요 · 셰셰(谢谢 xièxie) 감사합니다 · 뚜어사오 첸(多少钱 duōshao qián) 얼마예요? · 부하오이스(不好意思 bù hǎoyìsi) 실례합니다 · 짜이 날(在哪儿 zài nǎr) 어디에 있어요?',
    sources: [{ label: 'Wiktionary — 你好', url: 'https://en.wiktionary.org/wiki/%E4%BD%A0%E5%A5%BD' }, { label: 'Wiktionary — 多少钱', url: 'https://en.wiktionary.org/wiki/%E5%A4%9A%E5%B0%91%E9%8C%A2' }],
  },
]

export const facts: Record<string, Fact> = Object.fromEntries(list.map((f) => [f.id, f]))

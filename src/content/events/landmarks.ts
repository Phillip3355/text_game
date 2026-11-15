// 주요 명소의 세 장면짜리 이야기(아크).
//
// 엔진은 사건 한 장 = 시간대 한 칸이므로, 아크는 별도 스키마 없이 기존 필드로 엮는다.
//  - 첫 장(destination)의 선택지가 effects.followUp으로 다음 장(followup)을 예약한다.
//  - 어떤 선택지는 다음 장으로 이어지고, 어떤 선택지는 그 자리에서 방문을 끝낸다(시간 절약).
//  - setFlags / addItems로 얻은 것이 뒤 장면의 requires·판정 보너스(flag mod)·variants를 바꾼다.
//
//  와이탄   E02 → E02B → E12(황푸강의 밤, 단독 행선지이기도 함)
//  예원     E04 → E04B ⇄ E04C (순서 자유) → E23(후신팅 찻집)
//  신톈디   E08 → E08B → E08C   (기념관 선택 시 E08 → E08C 직행)
//  동방명주 E13 → E13B → E13C
//  톈쯔팡   E14 → E14B → E14C   (화가와 친해지면 E14 → E14C 직행)
import type { GameEvent } from '../../engine/types'
import { cultureCheck, foodCheck, lookCheck, socialCheck, zhCheck } from './helpers'

// ── 와이탄 ────────────────────────────────────────────────────────────────

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
  teaser: '황푸강을 따라 늘어선 백 년 전의 은행 건물들 — 낮에서 밤까지 이어지는 이야기',
  variants: [
    {
      when: [{ type: 'item', item: 'night_photo' }],
      text: ['밤에 강 건너 불빛을 찍었던 바로 그 난간이다. 해 아래에서 보니 같은 건물들이 전혀 다른 얼굴을 하고 있다.'],
    },
  ],
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
        text: '기둥의 양식이 건물마다 다르다. 이쪽은 그리스 신전처럼 굵은 기둥, 저쪽은 직선이 날렵한 아르데코. 옛 세관 건물의 시계탑 아래, 돌에 새겨진 연도를 찾아냈다. 1927.\n\n“만국건축박람군”이라는 별명이 왜 붙었는지 알 것 같다. 시계탑 바로 옆, 돔을 얹은 건물의 회전문으로 사람들이 드나든다. 저 안은 어떨까.',
        diary: '와이탄의 건물들을 하나하나 비교하며, 양식이 제각각인 ‘만국건축박람군’의 의미를 깨달았다.',
        effects: {
          tags: ['sight:bund', 'culture:bund_architecture'],
          knowledge: ['f_bund'],
          stats: { culture: 1 },
          stamina: -6,
          setFlags: ['bund-1927'],
          followUp: 'E02B',
        },
      },
    },
    {
      id: 'elder',
      text: '노신사에게 건물 이야기를 청한다',
      check: zhCheck(30, [{ stat: 'social', per: 5 }]),
      success: {
        text: '“这栋楼啊……(이 건물 말이지……)” 노신사의 눈이 반짝인다. 저 녹색 지붕 건물은 옛날 호텔인데, 지금도 밤이면 나이 지긋한 악사들이 재즈를 연주한다고. 젊을 적 거기서 아내와 춤을 췄다며 웃는다.\n\n“먼저 은행 안부터 들어가 봐요. 문은 누구에게나 열려 있으니까. 그리고 晚上再来。(밤에 다시 와요.) 강 건너 불이 켜지면 전혀 다른 곳이 되니까.”',
        diary: '와이탄에서 만난 노신사에게 화평반점의 재즈 이야기와 젊은 날의 추억을 들었다. 은행 안을 보고, 밤에 다시 오라고 했다.',
        effects: {
          tags: ['sight:bund', 'social:bund_elder', 'culture:bund_architecture'],
          knowledge: ['f_bund', 'f_peace_jazz'],
          setFlags: ['heard-jazz'],
          followUp: 'E02B',
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
      id: 'elder_photo',
      text: '노신사에게 밤에 찍은 야경 사진을 보여 준다',
      requires: [{ type: 'item', item: 'night_photo' }],
      success: {
        text: '휴대폰 화면을 내밀자 노신사가 안경을 고쳐 쓴다. 금빛으로 떠오른 녹색 지붕을 손가락으로 톡톡 두드린다. “就是这里！(바로 여기야!) 우리 집사람이랑 여기서 춤을 췄지.”\n\n그는 한참 사진을 들여다보다 지팡이를 짚고 일어선다. “跟我来。(따라와요.) 관광객들이 그냥 지나치는 걸 하나 보여 주지.”',
        diary: '와이탄의 노신사에게 밤에 찍은 야경 사진을 보여 주었다. 젊은 날 춤을 춘 곳이라며 반가워하고는, 직접 안내해 주겠다고 했다.',
        effects: {
          tags: ['sight:bund', 'social:bund_elder', 'culture:bund_architecture'],
          knowledge: ['f_bund', 'f_peace_jazz'],
          setFlags: ['heard-jazz', 'elder-friend'],
          followUp: 'E02B',
          stats: { social: 1 },
        },
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

export const E02B: GameEvent = {
  id: 'E02B',
  title: '시계탑 옆, 옛 은행의 돔',
  location: 'bund',
  kind: 'followup',
  category: 'sight',
  media: ['bund-2', 'bund-1'],
  facts: ['f_bund', 'f_peace_jazz'],
  variants: [
    {
      when: [{ type: 'flag', flag: 'elder-friend' }],
      text: ['노신사가 앞장선다. 지팡이 끝으로 회전문을 가리키며 “慢慢看。(천천히 봐요.)” 하고 웃는다.'],
    },
    {
      when: [{ type: 'flag', flag: 'heard-jazz' }],
      text: ['노신사가 말한 녹색 지붕의 호텔이 몇 걸음 북쪽에 보인다.'],
    },
  ],
  intro: [
    '세관 시계탑 바로 옆, 돔을 얹은 옛 은행 건물의 육중한 문을 밀고 들어간다. 바깥의 강바람 소리가 뚝 끊긴다.',
    '대리석 기둥이 둘러싼 팔각형 홀. 고개를 들자 돔 안쪽이 온통 작은 돌 조각으로 덮여 있다. 지금은 다른 은행이 쓰는 건물이라 창구 앞에는 번호표를 든 사람들이 조용히 앉아 있다.',
    '창밖으로 녹색 피라미드 지붕의 호텔이 보이고, 시계탑의 큰 바늘이 천천히 움직인다. 여기서 하루를 더 보낼지, 다른 곳으로 떠날지 정해야 한다.',
  ],
  choices: [
    {
      id: 'mosaic',
      text: '돔 천장의 모자이크를 하나하나 읽어 본다',
      check: lookCheck(30, [{ flag: 'bund-1927', bonus: 15 }]),
      success: {
        text: '목이 아플 만큼 올려다본다. 둥근 띠를 따라 별자리 그림이 돌아가고, 그 아래로 서로 다른 도시의 풍경이 여덟 칸에 나뉘어 있다. 배와 다리와 낯선 지붕들. 이 은행이 지점을 두었던 도시들이다.\n\n밖에서 찾아낸 1927이라는 숫자와, 천장 속 바다 건너 도시들. 와이탄은 처음부터 세계를 향해 지은 거리였다.',
        diary: '와이탄 옛 은행의 팔각 홀에서 돔 천장의 모자이크를 읽었다. 별자리와 여덟 도시의 풍경이 새겨져 있었다.',
        effects: { tags: ['hidden:bank_mosaic', 'culture:bund_architecture'], knowledge: ['f_bund'], stats: { observation: 1 }, stamina: -4 },
      },
      failure: {
        text: '빛이 반사되어 무늬가 잘 보이지 않는다. 한참 고개를 젖히고 서 있다가 경비원의 눈길을 받고 슬그머니 물러난다. 반짝이는 금빛만 눈에 남았다.',
        diary: '와이탄 옛 은행의 돔 천장을 올려다보았지만 무늬는 잘 보이지 않았다. 금빛만 눈에 남았다.',
        effects: { tags: ['culture:bund_architecture'], stamina: -4 },
      },
    },
    {
      id: 'elder_tour',
      text: '노신사의 안내를 따라 홀의 숨은 이야기를 듣는다',
      requires: [{ type: 'flag', flag: 'elder-friend' }],
      success: {
        text: '노신사가 목소리를 낮춘다. 이 천장은 오랫동안 하얀 칠 아래 숨어 있다가, 수리할 때 다시 드러났다고. “我小时候根本不知道上面有画。(어릴 땐 위에 그림이 있는 줄도 몰랐어.)”\n\n그는 여덟 도시를 하나씩 손가락으로 짚어 준다. 그리고 홀을 나서며 말한다. “今晚我在那儿。(오늘 밤 나는 저기 있을 거요.)” 녹색 지붕을 가리키며.',
        diary: '노신사의 안내로 와이탄 옛 은행 돔의 모자이크가 오랫동안 칠 아래 숨어 있었다는 이야기를 들었다. 밤에 재즈 바에서 다시 보자고 했다.',
        effects: {
          tags: ['hidden:bank_mosaic', 'social:bund_elder', 'culture:bund_architecture'],
          knowledge: ['f_bund'],
          setFlags: ['jazz-seat'],
          stats: { culture: 1 },
          count: ['zh'],
          followUp: 'E12',
        },
      },
    },
    {
      id: 'lobby',
      text: '북쪽 호텔 로비에 들러 재즈 공연 시간을 묻는다',
      requires: [{ type: 'flag', flag: 'heard-jazz' }],
      check: zhCheck(35, [{ stat: 'social', per: 5 }]),
      success: {
        text: '아르데코 무늬의 회전문, 팔각형 유리 천장 아래 로비. 프런트 직원이 공연 시간을 적어 주며 덧붙인다. “早点来，前面有位子。(일찍 오면 앞자리가 있어요.)”\n\n저녁까지 강변에서 기다리기로 한다.',
        diary: '화평반점 로비에 들러 중국어로 재즈 공연 시간을 물었다. 일찍 오면 앞자리가 있다고 했다.',
        effects: { tags: ['sight:bund'], knowledge: ['f_peace_jazz'], setFlags: ['jazz-seat'], count: ['zh'], followUp: 'E12' },
      },
      failure: {
        text: '프런트 직원의 대답이 빨라 시간만 겨우 알아들었다. 그래도 저녁에 다시 와 볼 이유는 생겼다.',
        diary: '화평반점 로비에서 재즈 공연 시간을 물었는데 시간만 겨우 알아들었다.',
        effects: { tags: ['sight:bund'], knowledge: ['f_peace_jazz'], count: ['zh-try'], followUp: 'E12' },
      },
    },
    {
      id: 'wait',
      text: '강변 벤치에 앉아 해가 질 때까지 머문다',
      success: {
        text: '시계탑의 종이 한 번, 또 한 번 울린다. 강 위로 화물선이 느릿느릿 지나가고, 하늘빛이 조금씩 묽어진다. 이 거리가 밤에 어떻게 변하는지 보고 가기로 한다.',
        diary: '와이탄 강변 벤치에 앉아 시계탑 종소리를 들으며 해가 지기를 기다렸다.',
        effects: { tags: ['sight:bund'], stamina: 6, followUp: 'E12' },
      },
    },
    {
      id: 'leave',
      text: '은행을 나와 다음 행선지로 향한다',
      success: {
        text: '회전문을 밀고 나오자 다시 강바람이다. 돔 아래의 고요함을 주머니에 넣고, 지하철역 쪽으로 걸음을 옮긴다.',
        diary: '와이탄 옛 은행의 홀을 둘러보고 다음 행선지로 떠났다.',
        effects: { knowledge: ['f_bund'] },
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
      when: [{ type: 'flag', flag: 'elder-friend' }],
      text: ['낮에 함께 걸었던 노신사의 말이 떠오른다. “今晚我在那儿。” 녹색 지붕 아래 창문에 불이 켜져 있다.'],
    },
    {
      when: [{ type: 'eventDone', event: 'E02B' }],
      text: ['낮에 들어갔던 은행의 돔이 조명을 받아 금빛으로 떠 있다. 그 안의 고요함이 거짓말 같다.'],
    },
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
      check: socialCheck(25, [{ flag: 'jazz-seat', bonus: 30 }, { flag: 'elder-friend', bonus: 20 }]),
      success: {
        text: '아르데코 장식의 로비를 지나 어둑한 바. 무대 바로 앞자리에 앉는다. 흰 머리의 연주자들이 느긋하게 스윙을 연주한다. 곡이 끝나자 트럼펫 주자가 이쪽으로 잔을 들어 보인다. “韩国朋友？(한국 친구?)” 다음 곡은 당신을 위한 것이라고 한다.\n\n노신사가 젊은 날 춤을 췄다는 곳이 바로 여기다.',
        diary: '화평반점 재즈 바 앞자리에서 흰 머리 연주자들의 올드 재즈를 들었다. 트럼펫 주자가 한 곡을 나에게 들려주었다.',
        effects: {
          tags: ['sight:huangpu_night', 'culture:old_jazz', 'social:jazz_band'],
          knowledge: ['f_peace_jazz'],
          stamina: 5,
        },
      },
      failure: {
        text: '바는 이미 만석이다. 입구 쪽 기둥 옆에 서서 듣는다. 사람들 머리 사이로 트럼펫의 금빛이 번쩍인다. 1930년대의 상하이가 기둥 너머에서 흘러나온다.',
        diary: '화평반점 재즈 바가 만석이라 입구 기둥 옆에 서서 올드 재즈를 들었다.',
        effects: { tags: ['sight:huangpu_night', 'culture:old_jazz'], knowledge: ['f_peace_jazz'] },
      },
    },
  ],
}

// ── 예원 ─────────────────────────────────────────────────────────────────

export const E04: GameEvent = {
  id: 'E04',
  title: '예원에서의 발견',
  location: 'yuyuan',
  kind: 'destination',
  category: 'culture',
  slots: [0, 1],
  weight: 1.3,
  media: ['yuyuan-1', 'yuyuan-2', 'yuyuan-4', 'yuyuan-5'],
  facts: ['f_yuyuan'],
  teaser: '명나라 관리가 부모를 위해 지은 전통 정원 — 정원 안쪽과 담장 밖 사당까지',
  intro: [
    '복잡한 옛 도심의 상가 골목을 지나 정원 문을 들어서자 소리가 달라진다. 처마 끝이 하늘로 휘어 오른 지붕, 잉어가 모이는 연못, 구불구불한 회랑.',
    '벽에 뚫린 둥근 문 너머로 또 다른 정원이 보이고, 그 너머로 또 하나가 보인다. 걸음을 옮길 때마다 풍경이 바뀐다.',
    '한쪽에서 관광객 몇이 처마 장식을 가리키며 저게 무슨 뜻이냐고 묻는다. 붉은 조끼를 입은 자원봉사 해설가가 근처에 서 있다. 담장 너머 어딘가에서 징 소리가 들린다.',
  ],
  choices: [
    {
      id: 'observe',
      text: '건축물과 창살 무늬를 자세히 관찰한다',
      requires: [{ type: 'stat', stat: 'observation', min: 2 }],
      check: lookCheck(40),
      success: {
        media: 'yuyuan-4',
        text: '처마 위에 작은 용과 인물상이 줄지어 있다. 회랑의 창은 하나도 같은 무늬가 없다. 매화, 얼음 갈라진 무늬, 동전 무늬.\n\n창살 사이로 안쪽 정원이 비친다. 구멍이 숭숭 뚫린 커다란 돌의 윗부분이 언뜻 보인다. 저쪽으로 가 봐야겠다.',
        diary: '예원의 처마 장식과 하나하나 다른 창살 무늬를 관찰하다가, 안쪽 정원의 구멍 뚫린 돌을 발견했다.',
        effects: {
          tags: ['sight:yuyuan', 'culture:garden'],
          knowledge: ['f_yuyuan'],
          stats: { culture: 1 },
          stamina: -6,
          setFlags: ['yuyuan-eye'],
          followUp: 'E04B',
        },
      },
      failure: {
        media: 'yuyuan-4',
        text: '창살 무늬가 하나씩 다르다는 건 알겠는데, 무엇을 뜻하는지는 모르겠다. 그래도 정원이 왜 ‘걸으며 보는 그림’이라 불리는지는 느낄 수 있었다. 회랑은 안쪽으로 계속 이어진다.',
        diary: '예원의 창살 무늬가 하나하나 다르다는 것을 발견했다.',
        effects: { tags: ['sight:yuyuan', 'culture:garden'], knowledge: ['f_yuyuan'], stamina: -8, followUp: 'E04B' },
      },
    },
    {
      id: 'guide',
      text: '해설가에게 중국어로 설명을 부탁한다',
      requires: [{ type: 'stat', stat: 'chinese', min: 3 }],
      check: zhCheck(25),
      success: {
        text: '해설가는 반가운 얼굴로 정원의 내력을 들려준다. 명나라 관리가 늙은 부모를 위해 지은 정원이라 ‘豫(기쁠 예)’ 자를 썼다고. 안쪽의 구멍 숭숭 뚫린 돌에는 이런 이야기가 있다. 아래에서 향을 피우면 구멍마다 연기가 피어오르고, 위에서 물을 부으면 구멍마다 물이 흘러나온다고.\n\n그리고 목소리를 낮춘다. “관광객은 잘 모르는데, 정원 동쪽 골목으로 나가면 옛날 그대로 사는 동네가 있어요. 한번 들어가 봐요.”',
        diary: '예원의 자원봉사 해설가에게 정원의 이름에 담긴 효심과 옥영롱의 전설을 듣고, 관광객이 모르는 근처 골목을 소개받았다.',
        effects: {
          tags: ['sight:yuyuan', 'culture:garden', 'social:garden_guide'],
          knowledge: ['f_yuyuan'],
          setFlags: ['alley-tip', 'jade-legend'],
          count: ['zh'],
          stats: { social: 1 },
          followUp: 'E04B',
        },
      },
      failure: {
        text: '해설가의 설명은 빠르고 전문 용어가 많다. 절반쯤 알아듣고 고개를 끄덕이자, 그는 웃으며 안내 책자 한 장을 건네준다.',
        diary: '예원 해설가의 설명을 절반쯤 알아들었다. 안내 책자를 한 장 받았다.',
        effects: { tags: ['sight:yuyuan'], knowledge: ['f_yuyuan'], count: ['zh-try'] },
      },
    },
    {
      id: 'temple',
      text: '담장 밖에서 들려오는 징 소리를 따라 나간다',
      success: {
        text: '정원 출구를 지나 소리 나는 쪽으로 걷는다. 향 냄새가 먼저 마중 나온다. 상가 건물들 사이로 붉은 기둥과 연기가 보인다.',
        diary: '예원 담장 밖에서 들려오는 징 소리와 향 냄새를 따라 걸었다.',
        effects: { tags: ['sight:yuyuan'], stamina: -4, followUp: 'E04C' },
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

export const E04B: GameEvent = {
  id: 'E04B',
  title: '옥영롱 앞에서',
  location: 'yuyuan',
  kind: 'followup',
  category: 'culture',
  media: ['yuyuan-5', 'yuyuan-2'],
  facts: ['f_yuyuan'],
  variants: [
    {
      when: [{ type: 'item', item: 'incense' }],
      text: ['가방 속 향 묶음에서 아직 성황묘의 냄새가 난다. 정원 안은 그곳보다 훨씬 조용하다.'],
    },
    {
      when: [{ type: 'flag', flag: 'jade-legend' }],
      text: ['해설가가 들려준 이야기가 귓가에 남아 있다. 구멍마다 연기가 피어오르는 돌.'],
    },
  ],
  intro: [
    '가산(假山)의 좁은 돌계단을 지나 안쪽 정원으로 들어선다. 인파가 한결 줄었다. 담장 위로 용의 몸통처럼 구불구불한 기와 능선이 이어진다.',
    '작은 연못 앞, 사람 키를 훌쩍 넘는 회색 돌 하나가 서 있다. 표면이 온통 구멍이다. 옥영롱(玉玲珑). 돌 옆에서 정원 관리인이 빗자루를 세워 두고 잠시 쉬고 있다.',
  ],
  choices: [
    {
      id: 'incense',
      text: '성황묘에서 사 온 향 묶음을 관리인에게 보인다',
      requires: [{ type: 'item', item: 'incense' }],
      success: {
        media: 'yuyuan-5',
        text: '관리인이 향 묶음을 보고 웃음을 터뜨린다. 정원 안에서는 불을 피울 수 없다며 손사래를 치더니, 대신 돌 뒤쪽으로 데려간다. “你看。(봐요.)”\n\n낮은 각도에서 올려다보니 앞쪽 구멍으로 들어온 빛이 위쪽 구멍 여러 개로 한꺼번에 새어 나간다. 연기도 이렇게 빠져나갔을 것이다. 아래에서 향을 피우면 구멍마다 연기, 위에서 물을 부으면 구멍마다 물. 전설이 눈앞에서 이해된다.',
        diary: '성황묘에서 산 향을 예원 관리인에게 보였더니, 옥영롱 뒤쪽에서 구멍마다 빛이 새어 나오는 각도를 알려 주었다. 연기의 전설이 이해되었다.',
        effects: {
          tags: ['hidden:jade_rock', 'culture:garden', 'solve:jade_legend'],
          knowledge: ['f_yuyuan'],
          setFlags: ['saw-inner'],
          stats: { culture: 1 },
          stamina: -4,
        },
      },
    },
    {
      id: 'study',
      text: '돌의 구멍을 하나하나 들여다본다',
      check: lookCheck(30, [{ flag: 'yuyuan-eye', bonus: 15 }, { flag: 'jade-legend', bonus: 15 }]),
      success: {
        media: 'yuyuan-5',
        text: '구멍들은 제멋대로 뚫린 것 같지만 안쪽에서 서로 이어져 있다. 한 구멍에 대고 숨을 내쉬자 위쪽 어딘가에서 희미하게 바람 소리가 난다. 이 돌은 비어 있는 것이 아니라, 길이 가득 차 있는 것이다.',
        diary: '예원의 명석 옥영롱의 구멍들이 안쪽에서 서로 이어져 있다는 것을 발견했다.',
        effects: { tags: ['hidden:jade_rock', 'culture:garden'], knowledge: ['f_yuyuan'], setFlags: ['saw-inner'], stamina: -6 },
      },
      failure: {
        text: '구멍을 세다가 스물에서 놓쳤다. 돌은 아름답지만, 그 비밀은 아직 알 수 없다.',
        diary: '예원의 옥영롱 앞에서 구멍을 세다 포기했다.',
        effects: { tags: ['culture:garden'], setFlags: ['saw-inner'], stamina: -6 },
      },
    },
    {
      id: 'temple',
      text: '정원 출구로 나가 성황묘 쪽으로 걷는다',
      requires: [{ type: 'noFlag', flag: 'saw-temple' }],
      success: {
        text: '돌을 뒤로하고 출구를 찾는다. 담장 밖에서 징 소리와 향 냄새가 다시 밀려온다.',
        diary: '예원 안쪽 정원을 나와 성황묘 쪽으로 걸었다.',
        effects: { tags: ['sight:yuyuan'], setFlags: ['saw-inner'], stamina: -4, followUp: 'E04C' },
      },
    },
    {
      id: 'teahouse',
      text: '연못 바깥, 구곡교 끝의 찻집으로 향한다',
      success: {
        media: 'yuyuan-3',
        text: '정원을 나와 연못가로 간다. 지그재그 다리가 아홉 번 꺾이며 물 위로 뻗어 있고, 그 끝에 이층 누각 찻집이 떠 있다. 다리 쉬어 갈 때다.',
        diary: '예원 안쪽 정원을 둘러본 뒤 구곡교 끝의 찻집으로 향했다.',
        effects: { tags: ['sight:yuyuan'], setFlags: ['saw-inner'], stamina: -4, followUp: 'E23' },
      },
    },
  ],
}

export const E04C: GameEvent = {
  id: 'E04C',
  title: '성황묘의 향 연기',
  location: 'yuyuan_bazaar',
  kind: 'followup',
  category: 'culture',
  media: ['xiaolongbao-4', 'yuyuan-1'],
  facts: ['f_yuyuan'],
  variants: [
    {
      when: [{ type: 'flag', flag: 'saw-inner' }],
      text: ['정원의 고요함에서 빠져나오자 소리가 한꺼번에 몰려온다.'],
    },
  ],
  intro: [
    '정원 담장 밖은 딴 세상이다. 처마를 겹겹이 올린 상가 건물들 사이로 사람들이 밀려다니고, 그 한가운데에 붉은 기둥의 사당이 있다. 성황묘(城隍庙). 이 도시를 지키는 신을 모신 곳이다.',
    '향로 앞에서 연기가 뭉게뭉게 오른다. 향을 머리 위로 들고 세 번 절하는 사람들, 대나무 제비 통을 흔드는 사람들. 입구 옆 노점에서 향 묶음을 판다.',
  ],
  choices: [
    {
      id: 'incense',
      text: '향을 사서 올리고, 남은 묶음을 챙겨 정원 안쪽으로 간다',
      requires: [{ type: 'noFlag', flag: 'saw-inner' }],
      cost: 5,
      success: {
        text: '옆 사람을 따라 향 세 개에 불을 붙이고 머리 위로 들어 세 번 고개를 숙인다. 연기가 눈을 맵게 한다. 남은 향 묶음은 가방에 넣는다.\n\n해설가가 말하던 구멍 뚫린 돌이 떠오른다. 이 향을 들고 그 앞에 서면 어떨까.',
        diary: '성황묘에서 향을 사서 올리고, 남은 향 묶음을 챙겨 예원 안쪽 정원으로 향했다.',
        effects: {
          tags: ['culture:city_god'],
          addItems: ['incense'],
          setFlags: ['saw-temple'],
          followUp: 'E04B',
        },
      },
    },
    {
      id: 'pray',
      text: '사람들을 따라 향로 앞에서 고개를 숙인다',
      success: {
        text: '향을 사지 않아도 아무도 뭐라 하지 않는다. 연기 너머로 손을 모으고 고개를 숙인다. 옆의 할머니가 무언가 길게 중얼거린다. 가족의 건강일까, 손주의 시험일까. 이 도시 사람들의 소원이 연기에 섞여 하늘로 올라간다.',
        diary: '성황묘 향로 앞에서 사람들을 따라 고개를 숙였다. 이 도시 사람들의 소원이 연기에 섞여 올라갔다.',
        effects: { tags: ['culture:city_god'], setFlags: ['saw-temple'], stamina: -2 },
      },
    },
    {
      id: 'fortune',
      text: '제비 통을 흔들어 뽑고, 풀이를 청한다',
      check: zhCheck(25, [{ stat: 'culture', per: 5 }]),
      success: {
        text: '대나무 통을 흔들자 제비 하나가 툭 튀어나온다. 번호를 들고 풀이해 주는 창구로 가니 안경 쓴 아저씨가 종이를 읽어 준다. “出门遇贵人。(길을 나서면 귀인을 만난다.)” 여행자에게 이보다 좋은 점괘가 있을까.',
        diary: '성황묘에서 제비를 뽑아 중국어로 풀이를 들었다. ‘길을 나서면 귀인을 만난다’는 점괘였다.',
        effects: { tags: ['culture:city_god', 'solve:fortune_slip'], setFlags: ['saw-temple'], count: ['zh'] },
      },
      failure: {
        text: '제비는 뽑았는데 풀이가 너무 어렵다. 아저씨가 손짓 발짓으로 설명하다가 결국 엄지를 치켜든다. 좋은 뜻이라는 것만은 알겠다.',
        diary: '성황묘에서 제비를 뽑았지만 풀이를 다 알아듣지 못했다. 좋은 뜻이라는 것만 알았다.',
        effects: { tags: ['culture:city_god'], setFlags: ['saw-temple'], count: ['zh-try'] },
      },
    },
    {
      id: 'garden',
      text: '향 냄새를 뒤로하고 정원 안쪽으로 들어간다',
      requires: [{ type: 'noFlag', flag: 'saw-inner' }],
      success: {
        text: '사당 앞의 소란을 빠져나와 다시 정원 문으로 향한다. 해설가가 말한 그 돌을 직접 봐야겠다.',
        diary: '성황묘를 잠시 둘러보고 예원 안쪽 정원으로 들어갔다.',
        effects: { setFlags: ['saw-temple'], stamina: -2, followUp: 'E04B' },
      },
    },
    {
      id: 'bazaar',
      text: '처마 아래 상가 골목을 구경하며 걷는다',
      success: {
        media: 'xiaolongbao-4',
        text: '부채 가게, 도장 가게, 찹쌀 경단을 빚는 가게. 처마 끝에 매달린 붉은 등이 바람에 흔들린다. 사람에 떠밀려 걷다 보니 어느새 상가 끝이다.',
        diary: '성황묘 주변 상가 골목을 사람들에 떠밀려 구경했다.',
        effects: { tags: ['sight:yuyuan'], setFlags: ['saw-temple'], stamina: -6 },
      },
    },
  ],
}

// ── 신톈디 ───────────────────────────────────────────────────────────────

export const E08: GameEvent = {
  id: 'E08',
  title: '신톈디의 돌 대문',
  location: 'xintiandi',
  kind: 'destination',
  category: 'culture',
  weight: 1.3,
  slots: [1, 2],
  media: ['xintiandi-1', 'xintiandi-3', 'xintiandi-2'],
  facts: ['f_shikumen', 'f_xintiandi'],
  teaser: '옛 스쿠먼 골목을 되살린 거리 — 대문 안쪽의 살림과 불이 켜지는 저녁까지',
  intro: [
    '회색 벽돌 벽에 돌로 짠 문틀, 그 안에 검게 칠한 두 짝의 나무 대문. 신톈디(新天地)의 골목은 백 년 전 상하이 사람들이 살던 스쿠먼(石库门) 주택을 그대로 살려 만들었다.',
    '지금 그 대문 안에는 카페와 식당, 작은 상점이 들어서 있다. 골목 안쪽으로 좁은 룽탕이 갈라지고, 다른 쪽 모퉁이의 스쿠먼 건물 앞에는 사람들이 줄을 서 있다.',
  ],
  choices: [
    {
      id: 'doors',
      text: '대문의 돌 장식을 자세히 살핀다',
      requires: [{ type: 'stat', stat: 'observation', min: 2 }],
      success: {
        media: 'xintiandi-3',
        text: '문틀 위 반원 아치 안에 서양식 덩굴 무늬와 중국식 길상 무늬가 함께 새겨져 있다. 동양과 서양이 한 대문 위에서 만났다. 스쿠먼이 상하이에서만 태어날 수 있었던 이유다.\n\n같은 무늬가 이 대문 저 대문으로 이어진다. 무늬를 따라가다 보니 어느새 골목 안쪽이다.',
        diary: '신톈디 스쿠먼 대문 위에서 서양식 덩굴 무늬와 중국식 길상 무늬가 함께 새겨진 장식을 찾았다.',
        effects: {
          tags: ['sight:xintiandi', 'culture:shikumen'],
          knowledge: ['f_shikumen'],
          stats: { culture: 1 },
          setFlags: ['read-lintel'],
          followUp: 'E08B',
        },
      },
    },
    {
      id: 'wander',
      text: '대문 사이 좁은 룽탕 안쪽으로 걸어 들어간다',
      success: {
        text: '큰길의 카페 소리가 등 뒤로 멀어진다. 어깨 너비만 한 골목, 머리 위로 엇갈린 빨래 장대 자리. 몇 걸음 더 들어가자 ‘屋里厢’이라는 문패가 붙은 집이 나온다.',
        diary: '신톈디 큰길에서 벗어나 좁은 룽탕 안쪽으로 걸어 들어갔다.',
        effects: { tags: ['sight:xintiandi'], stamina: -4, followUp: 'E08B' },
      },
    },
    {
      id: 'history',
      text: '모퉁이의 기념관에서 근대사를 살펴본다',
      check: cultureCheck(40),
      success: {
        media: 'xintiandi-2',
        text: '1921년 여름, 이 스쿠먼 집 안에서 중국공산당 제1차 전국대표대회가 열렸다는 설명이 붙어 있다. 작은 방 하나에 놓인 긴 탁자. 평범한 주택가의 한 집이 중국 근대사의 한 장면이 되었다.\n\n기념관을 나서니 해가 꽤 기울었다.',
        diary: '신톈디 모퉁이의 기념관에서 1921년 이곳 스쿠먼 집에서 열린 회의에 관한 근대사 전시를 보았다.',
        effects: {
          tags: ['sight:xintiandi', 'culture:modern_history'],
          knowledge: ['f_xintiandi'],
          setFlags: ['knows-1921'],
          stamina: -5,
          followUp: 'E08C',
        },
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

export const E08B: GameEvent = {
  id: 'E08B',
  title: '대문 안쪽, 屋里厢',
  location: 'xintiandi',
  kind: 'followup',
  category: 'culture',
  media: ['xintiandi-3', 'xintiandi-1'],
  facts: ['f_shikumen', 'f_lilong'],
  variants: [
    {
      when: [{ type: 'flag', flag: 'read-lintel' }],
      text: ['이 집 대문 위에도 아까 본 덩굴 무늬가 있다. 조금 더 닳았을 뿐이다.'],
    },
  ],
  intro: [
    '문패의 ‘屋里厢’은 상하이 말로 ‘집 안’이라는 뜻이다. 옛 스쿠먼 한 채를 살림살이째 되살려 둔 작은 전시관이다.',
    '검은 대문을 밀면 하늘이 뚫린 좁은 마당 톈징(天井)이 먼저 나온다. 그 뒤로 손님을 맞던 거실, 가파른 나무 계단, 계단 중간의 작은 다락방. 입구 의자에는 백발의 할아버지가 부채를 부치며 앉아 있다.',
  ],
  choices: [
    {
      id: 'museum',
      text: '표를 끊고 다락방을 지나 옥상까지 올라가 본다',
      cost: 20,
      success: {
        text: '좁고 가파른 나무 계단, 부엌 위의 작은 다락방 정쯔젠(亭子间). 천장이 낮아 이마를 찧는다. 한때 가난한 작가들이 세 들어 글을 쓰던 방이라는 설명이 붙어 있다. 옥상에 오르면 기와지붕들이 끝없이 이어진다.\n\n한 집에 여러 가족이 나눠 살던 시절, 집과 집 사이 골목이 곧 마당이었다.',
        diary: '신톈디의 스쿠먼 전시관에서 좁은 계단과 다락방 정쯔젠, 기와지붕이 이어지는 옥상을 보았다.',
        effects: {
          tags: ['culture:shikumen', 'culture:lilong_life'],
          knowledge: ['f_shikumen', 'f_lilong'],
          setFlags: ['tingzijian'],
          stamina: -5,
          followUp: 'E08C',
        },
      },
    },
    {
      id: 'motif',
      text: '대문에서 본 덩굴 무늬를 집 안에서 다시 찾아본다',
      requires: [{ type: 'flag', flag: 'read-lintel' }],
      check: lookCheck(35),
      success: {
        text: '톈징 벽의 창 위, 계단 난간 끝, 거실 문틀. 같은 덩굴 무늬가 집 안 곳곳에 작게 반복되어 있다. 대문의 장식은 겉치레가 아니라 이 집 전체의 서명이었다.',
        diary: '신톈디 스쿠먼 집 안 곳곳에서 대문과 같은 덩굴 무늬를 찾아냈다. 집 전체의 서명 같았다.',
        effects: { tags: ['hidden:shikumen_motif', 'culture:shikumen'], stats: { observation: 1 }, stamina: -3, followUp: 'E08C' },
      },
      failure: {
        text: '창틀과 난간을 한참 살폈지만 같은 무늬는 보이지 않는다. 대신 계단 손잡이가 사람 손에 반들반들 닳아 있는 것을 보았다.',
        diary: '신톈디 스쿠먼 집 안에서 대문의 무늬를 찾지 못했지만, 반들반들 닳은 계단 손잡이를 보았다.',
        effects: { tags: ['culture:shikumen'], stamina: -3 },
      },
    },
    {
      id: 'grandpa',
      text: '입구의 할아버지에게 이 골목의 옛날을 묻는다',
      check: socialCheck(25, [{ flag: 'read-lintel', bonus: 10 }]),
      success: {
        text: '할아버지는 이 근처 룽탕에서 나고 자랐다고 한다. 한 집에 일곱 가구가 살았고, 아침이면 골목 수돗가에 줄을 섰다고. “那时候热闹啊。(그땐 시끌벅적했지.)”\n\n그는 주머니에서 빛바랜 사진 한 장을 꺼낸다. 빨래 장대가 가득한 골목, 그 끝의 대문 하나. “这扇门还在。(이 대문은 아직 있어요.) 찾아봐요.”',
        diary: '신톈디 스쿠먼 전시관의 할아버지에게 일곱 가구가 한 집에 살던 시절 이야기를 듣고, 옛 골목 사진 한 장을 받았다.',
        effects: {
          tags: ['social:shikumen_elder', 'culture:lilong_life'],
          knowledge: ['f_lilong'],
          addItems: ['old_photo'],
          count: ['zh'],
          followUp: 'E08C',
        },
      },
      failure: {
        text: '할아버지가 상하이 말로 무언가 길게 말한다. 알아들은 것은 ‘屋里厢’ 하나. 그가 웃으며 부채로 계단 쪽을 가리킨다. 올라가 보라는 뜻이다.',
        diary: '신톈디 스쿠먼 전시관의 할아버지와 이야기하려 했지만 상하이 말을 알아듣지 못했다.',
        effects: { count: ['zh-try'] },
      },
    },
    {
      id: 'dusk',
      text: '톈징에 서서 하늘이 저물어 가는 것을 본다',
      success: {
        text: '네모난 하늘 조각 위로 구름이 천천히 지나간다. 백 년 전 이 마당에서도 누군가 같은 하늘을 올려다보았을 것이다. 조금 더 머물다 가기로 한다.',
        diary: '신톈디 스쿠먼 집의 톈징에 서서 네모난 하늘을 올려다보았다.',
        effects: { stamina: 4, followUp: 'E08C' },
      },
    },
    {
      id: 'leave',
      text: '골목을 빠져나와 다음 행선지로 향한다',
      success: {
        text: '대문을 닫고 나온다. 등 뒤에서 할아버지의 부채 소리가 멀어진다.',
        diary: '신톈디의 스쿠먼 집을 나와 다음 행선지로 향했다.',
        effects: { knowledge: ['f_shikumen'] },
      },
    },
  ],
}

export const E08C: GameEvent = {
  id: 'E08C',
  title: '신톈디, 불이 켜질 무렵',
  location: 'xintiandi',
  kind: 'followup',
  category: 'culture',
  slots: [2, 3],
  media: ['xintiandi-1', 'xintiandi-3'],
  facts: ['f_xintiandi', 'f_shikumen'],
  variants: [
    {
      when: [{ type: 'flag', flag: 'knows-1921' }],
      text: ['기념관에서 본 작은 방의 긴 탁자가 아직 눈에 선하다.'],
    },
    {
      when: [{ type: 'flag', flag: 'tingzijian' }],
      text: ['다락방 낮은 천장에 찧은 이마가 아직 얼얼하다.'],
    },
  ],
  intro: [
    '해가 비스듬히 기울자 골목의 회색 벽돌이 꿀빛으로 물든다. 대문마다 조명이 하나둘 켜지고, 테라스의 의자가 사람으로 찬다.',
    '골목 남쪽 끝으로 나가면 작은 호수를 낀 공원이 있다. 호수 건너편 유리 빌딩에 회색 벽돌 골목이 거꾸로 비친다. 백 년 된 집과 새 빌딩이 한 수면 위에 겹쳐 있다.',
  ],
  choices: [
    {
      id: 'lake',
      text: '호숫가를 한 바퀴 걸으며 유리에 비친 골목을 본다',
      success: {
        text: '물가를 따라 걷는다. 유리 빌딩에 비친 골목은 물에 한 번 더 비쳐 흔들린다. 옛것을 허물지 않고 그 옆에 새것을 세운 거리. 그 모습이 수면에서 하나로 합쳐진다.',
        diary: '신톈디 옆 호숫가를 걸으며 유리 빌딩에 비친 스쿠먼 골목을 보았다.',
        effects: { tags: ['sight:xintiandi'], knowledge: ['f_xintiandi'], stamina: -4 },
      },
    },
    {
      id: 'notes',
      text: '낮에 본 것과 지금의 골목을 수첩에 나란히 적어 본다',
      requires: [{ type: 'any', of: [{ type: 'flag', flag: 'tingzijian' }, { type: 'flag', flag: 'knows-1921' }] }],
      check: cultureCheck(40, [{ flag: 'tingzijian', bonus: 10 }, { flag: 'knows-1921', bonus: 10 }]),
      success: {
        text: '왼쪽 장에는 일곱 가구가 나눠 쓰던 좁은 계단과 다락방, 긴 탁자 하나 놓인 작은 방. 오른쪽 장에는 같은 대문 안의 와인 잔과 조명. 두 장을 나란히 놓고 보니 알겠다. 이 골목은 박제가 아니라, 쓰임을 바꿔 가며 살아남은 집들이다.',
        diary: '신톈디의 낮과 저녁을 수첩에 나란히 적으며, 스쿠먼이 쓰임을 바꿔 가며 살아남았다는 것을 깨달았다.',
        effects: { tags: ['culture:shikumen_renewal'], knowledge: ['f_xintiandi'], stats: { culture: 1 } },
      },
      failure: {
        text: '적기 시작했는데 생각이 자꾸 엇갈린다. 수첩에는 화살표와 물음표만 남았다. 그래도 이 물음표들이 여행의 몫이다.',
        diary: '신톈디의 낮과 저녁을 수첩에 적어 보려 했지만 물음표만 남았다.',
        effects: { knowledge: ['f_xintiandi'] },
      },
    },
    {
      id: 'photo',
      text: '할아버지가 준 옛 사진 속 대문을 찾아 나선다',
      requires: [{ type: 'item', item: 'old_photo' }],
      check: lookCheck(35, [{ flag: 'read-lintel', bonus: 15 }]),
      success: {
        text: '사진을 들고 대문을 하나씩 대조한다. 문틀 위 아치의 금, 오른쪽 기둥의 깨진 모서리. 찾았다. 사진 속 빨래 장대는 사라지고 그 자리에 작은 조명이 걸려 있지만, 대문은 그대로다.\n\n같은 자리에서 사진을 한 장 찍는다. 두 장의 사진 사이에 육십 년이 있다.',
        diary: '스쿠먼 할아버지가 준 옛 사진 속 대문을 신톈디에서 찾아냈다. 같은 자리에서 사진을 찍었다.',
        effects: { tags: ['hidden:old_lane', 'solve:old_photo'], stamina: -6 },
      },
      failure: {
        text: '비슷한 대문이 너무 많다. 다섯 번째 대문 앞에서 포기하고, 사진을 수첩 사이에 고이 끼워 둔다. 언젠가 다시 와서 찾아봐야겠다.',
        diary: '옛 사진 속 대문을 찾으려 했지만 비슷한 대문이 너무 많았다. 사진은 수첩에 끼워 두었다.',
        effects: { stamina: -8 },
      },
    },
    {
      id: 'bar',
      text: '스쿠먼 건물 안의 바에서 한 잔 하며 쉰다',
      cost: 40,
      success: {
        text: '돌 문틀 아래 작은 바. 창가에 앉아 차가운 잔을 손에 쥔다. 대문 안쪽에서 바라보는 골목은 또 다르다. 오늘 걸은 길이 잔 속에서 천천히 가라앉는다.',
        diary: '신톈디의 스쿠먼 건물 안 바에 앉아 대문 안쪽에서 골목을 바라보며 쉬었다.',
        effects: { stamina: 15 },
      },
    },
  ],
}

// ── 동방명주 ─────────────────────────────────────────────────────────────

export const E13: GameEvent = {
  id: 'E13',
  title: '동방명주의 구슬',
  location: 'oriental_pearl',
  kind: 'destination',
  category: 'sight',
  weight: 1.7,
  slots: [1, 2],
  media: ['oriental_pearl-1', 'oriental_pearl-3', 'oriental_pearl-2'],
  facts: ['f_oriental_pearl'],
  teaser: '구슬을 꿴 듯한 상하이의 상징 방송탑 — 줄 끝에서 구슬 속, 발밑의 허공까지',
  intro: [
    '분홍빛 구슬을 꿰어 세운 듯한 탑. 동방명주(东方明珠)는 사진으로 수없이 봤지만 아래에서 올려다보니 생각보다 훨씬 크다.',
    '굵은 기둥 세 개가 비스듬히 커다란 구슬을 받치고, 그 위로 작은 구슬들이 하늘을 향해 이어진다. 전망대로 올라가는 줄이 길게 늘어서 있다.',
  ],
  choices: [
    {
      id: 'queue',
      text: '전망대 줄 끝에 선다',
      success: {
        text: '줄은 탑의 다리 사이를 감고 돈다. 한 걸음, 또 한 걸음. 위를 올려다볼 때마다 구슬이 조금씩 커진다.',
        diary: '동방명주 전망대에 오르려고 긴 줄 끝에 섰다.',
        effects: { tags: ['sight:oriental_pearl'], knowledge: ['f_oriental_pearl'], stamina: -4, followUp: 'E13B' },
      },
    },
    {
      id: 'design',
      text: '탑 아래 공원에서 구조를 찬찬히 뜯어본다',
      requires: [{ type: 'stat', stat: 'observation', min: 2 }],
      check: cultureCheck(45),
      success: {
        text: '크고 작은 구슬이 높이마다 다르게 배치되어 있다. 안내판에 따르면 당나라 시 「비파행」의 ‘큰 구슬 작은 구슬이 옥 쟁반에 떨어지네’라는 구절에서 영감을 얻었다고 한다. 강철 탑에 시 한 구절이 들어 있었다.\n\n저 구슬 안에 직접 들어가 보고 싶어진다. 줄 끝으로 간다.',
        diary: '동방명주의 구슬 배치가 당나라 시 「비파행」의 한 구절에서 영감을 얻었다는 것을 알게 되었다.',
        effects: {
          tags: ['sight:oriental_pearl', 'culture:pearl_design'],
          knowledge: ['f_oriental_pearl'],
          setFlags: ['pipa-poem'],
          followUp: 'E13B',
        },
      },
      failure: {
        text: '구슬이 몇 개인지 세다가 포기했다. 그래도 아래에서 올려다본 각도는 어떤 엽서보다 극적이다.',
        diary: '동방명주의 구슬을 세어 보다 포기했다. 아래서 올려다본 탑은 엽서보다 극적이었다.',
        effects: { tags: ['sight:oriental_pearl'] },
      },
    },
    {
      id: 'riverbank',
      text: '탑 아래 강변으로 내려가 걸었던 와이탄을 건너다본다',
      requires: [{ type: 'visited', location: 'bund' }],
      success: {
        text: '강변 난간에 서자 강 건너에 와이탄의 석조 건물들이 한 줄로 서 있다. 저쪽에서 이쪽을 볼 때는 미래 같았는데, 이쪽에서 저쪽을 보니 과거 같다. 강 하나가 백 년을 가른다.',
        diary: '동방명주 아래 강변에서 걸었던 와이탄을 건너다보았다. 강 하나가 백 년을 가르고 있었다.',
        effects: { tags: ['sight:oriental_pearl', 'culture:huangpu'], knowledge: ['f_huangpu'], stamina: -4 },
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

export const E13B: GameEvent = {
  id: 'E13B',
  title: '큰 구슬 속으로',
  location: 'oriental_pearl',
  kind: 'followup',
  category: 'sight',
  media: ['oriental_pearl-3', 'oriental_pearl-1'],
  facts: ['f_oriental_pearl', 'f_lujiazui'],
  variants: [
    {
      when: [{ type: 'flag', flag: 'pipa-poem' }],
      text: ['‘큰 구슬 작은 구슬’. 줄에 서서 그 구절을 입속으로 굴려 본다.'],
    },
  ],
  intro: [
    '줄이 매표소 앞까지 줄어들었다. 바로 앞에는 교복을 입은 학생들이 시끄럽게 떠들고, 매표소 위 전광판에는 오늘의 가시거리가 떠 있다. ‘能见度 良好’ — 가시거리 양호.',
    '저 위, 가장 큰 구슬까지 엘리베이터가 쉼 없이 오르내린다. 표값을 확인하고 지갑을 연다.',
  ],
  choices: [
    {
      id: 'up',
      text: '표를 끊고 큰 구슬 전망층으로 오른다',
      cost: 100,
      success: {
        media: 'oriental_pearl-2',
        text: '귀가 먹먹해질 만큼 빠른 엘리베이터. 문이 열리자 둥근 유리창 너머로 도시가 한 바퀴 돈다. 바로 옆에 루자쭈이의 세 탑, 발아래 굽이치는 황푸강, 강 건너 와이탄의 석조 건물들.\n\n안내원이 한 층 아래를 가리킨다. 바닥까지 유리로 된 회랑이 있다고.',
        diary: '동방명주의 큰 구슬 전망층에 올라 루자쭈이와 황푸강, 와이탄을 한눈에 내려다보았다.',
        effects: { tags: ['sight:oriental_pearl', 'culture:modern_pudong'], knowledge: ['f_lujiazui'], stamina: -4, followUp: 'E13C' },
      },
    },
    {
      id: 'students',
      text: '앞에 선 학생들에게 말을 걸며 함께 오른다',
      cost: 100,
      check: socialCheck(30),
      success: {
        text: '“你们是哪个学校的？(어느 학교예요?)” 학생들이 와르르 웃으며 돌아본다. 수학여행이란다. 엘리베이터 안에서 한 아이가 비밀을 알려 준다. “玻璃上面不要往下看，看远处！(유리 위에선 아래 보지 말고 멀리 봐요!)”\n\n문이 열리자 학생들이 손을 흔들며 흩어진다.',
        diary: '동방명주 줄에서 수학여행 온 학생들과 이야기하며 함께 올랐다. 유리 바닥에선 멀리 보라는 비결을 들었다.',
        effects: {
          tags: ['sight:oriental_pearl', 'social:pearl_students'],
          setFlags: ['glass-tip'],
          count: ['zh'],
          stamina: -2,
          followUp: 'E13C',
        },
      },
      failure: {
        text: '말을 걸었지만 학생들은 자기들끼리의 이야기에 빠져 있다. 엘리베이터 안에서 어색하게 웃고, 문이 열리자 각자 흩어진다. 창밖 풍경은 그래도 숨이 막히게 넓다.',
        diary: '동방명주 줄에서 학생들에게 말을 걸었지만 대화는 이어지지 않았다. 창밖 풍경은 넓었다.',
        effects: { tags: ['sight:oriental_pearl'], count: ['zh-try'], stamina: -4, followUp: 'E13C' },
      },
    },
    {
      id: 'giveup',
      text: '표값을 보고 발길을 돌린다',
      success: {
        text: '전광판의 숫자를 한참 보다가 줄에서 빠져나온다. 대신 탑 아래 잔디밭에 앉아 구슬을 올려다본다. 위에서 보는 도시는 다음 기회에.',
        diary: '동방명주 전망대 표값을 보고 줄에서 빠져나와 탑 아래 잔디밭에서 쉬었다.',
        effects: { stamina: 6 },
      },
    },
  ],
}

export const E13C: GameEvent = {
  id: 'E13C',
  title: '발밑의 허공',
  location: 'oriental_pearl',
  kind: 'followup',
  category: 'sight',
  media: ['oriental_pearl-2', 'oriental_pearl-1'],
  facts: ['f_oriental_pearl', 'f_huangpu'],
  intro: [
    '한 층을 내려가자 구슬 둘레를 따라 바깥으로 회랑이 이어진다. 바닥이 투명하다. 유리 아래로 수백 미터의 허공, 그 밑에 장난감 같은 자동차들.',
    '어떤 사람은 유리 위에 드러누워 사진을 찍고, 어떤 사람은 벽에 등을 붙이고 게걸음으로 지나간다.',
  ],
  choices: [
    {
      id: 'glass',
      text: '유리 바닥 한가운데로 걸어 나간다',
      check: { base: 55, mods: [{ stat: 'observation', per: 5 }, { traveler: 'wanderer', bonus: 10 }, { flag: 'glass-tip', bonus: 15 }] },
      success: {
        media: 'oriental_pearl-2',
        text: '발아래가 투명하다. 수백 미터 아래로 자동차들이 개미처럼 움직인다. 숨을 한 번 고르고, 아래가 아니라 멀리 강 끝을 보며 한가운데로 걸어가 선다. 무릎이 떨리지만, 해냈다.',
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
      id: 'mirror',
      text: '와이탄에서 찍은 야경 사진을 꺼내 그 자리를 위에서 찾는다',
      requires: [{ type: 'item', item: 'night_photo' }],
      success: {
        text: '사진 속 가로등 기둥과 난간의 곡선을 기억하며 강 건너를 훑는다. 저기다. 그날 밤 휴대폰을 기대었던 바로 그 기둥이 성냥개비만 하게 보인다.\n\n그때 렌즈 한가운데 있던 이 탑에, 지금 내가 서 있다. 사진 한 장이 강을 건너 거울처럼 접힌다.',
        diary: '동방명주 위에서, 와이탄에서 야경을 찍었던 바로 그 자리를 찾아냈다. 사진 속 탑에 내가 서 있었다.',
        effects: { tags: ['hidden:pearl_mirror', 'culture:huangpu'], knowledge: ['f_huangpu'], stats: { observation: 1 } },
      },
    },
    {
      id: 'window',
      text: '유리 위에 서지 않고 창가에서 강의 굽이를 내려다본다',
      success: {
        text: '창에 이마를 대고 강을 내려다본다. 황푸강이 루자쭈이를 끼고 크게 굽이친다. 이 굽이 안쪽이 서른여 년 전에는 논과 창고였다는 게 믿기지 않는다. 바닥은 무서워도 풍경은 무섭지 않다.',
        diary: '동방명주 전망층 창가에서 루자쭈이를 끼고 크게 굽이치는 황푸강을 내려다보았다.',
        effects: { knowledge: ['f_huangpu'], stamina: 3 },
      },
    },
  ],
}

// ── 톈쯔팡 ───────────────────────────────────────────────────────────────

export const E14: GameEvent = {
  id: 'E14',
  title: '톈쯔팡의 미로',
  location: 'tianzifang',
  kind: 'destination',
  category: 'culture',
  slots: [1, 2],
  media: ['tianzifang-1', 'tianzifang-2', 'tianzifang-3'],
  facts: ['f_tianzifang', 'f_lilong'],
  teaser: '공방과 갤러리가 숨은 스쿠먼 골목 — 간판이 끊기는 곳, 화가의 작업실까지',
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
        text: '도장 새기는 집, 염색 천을 파는 집, 손으로 그린 엽서를 파는 집. 스쿠먼 대문을 그린 엽서 한 장을 고른다. 1990년대 말 예술가들이 빈 공장에 작업실을 내면서 이 골목이 바뀌기 시작했다고 주인이 말해 준다.\n\n“엽서 속 대문은 이 골목 안쪽에 진짜로 있어요.” 주인이 턱으로 골목 깊은 곳을 가리킨다.',
        diary: '톈쯔팡의 공방들을 둘러보고, 스쿠먼 대문이 그려진 엽서를 샀다. 그 대문이 골목 안쪽에 진짜로 있다고 했다.',
        effects: {
          tags: ['sight:tianzifang', 'culture:art_lanes'],
          addItems: ['postcard'],
          knowledge: ['f_tianzifang'],
          stamina: -5,
          followUp: 'E14B',
        },
      },
    },
    {
      id: 'deeper',
      text: '골목 가장 깊은 곳까지 들어가 본다',
      requires: [{ type: 'any', of: [{ type: 'stat', stat: 'observation', min: 3 }, { type: 'item', item: 'paper_map' }] }],
      success: {
        media: 'tianzifang-2',
        text: '갈림길마다 사람이 적은 쪽을 고른다. 세 번 꺾자 공방 간판이 드문드문해지고, 머리 위로 빨래가 늘어난다.',
        diary: '톈쯔팡에서 사람이 적은 쪽만 골라 골목 깊숙이 들어갔다.',
        effects: { tags: ['sight:tianzifang'], knowledge: ['f_lilong'], stamina: -4, followUp: 'E14B' },
      },
    },
    {
      id: 'painter',
      text: '그림 그리는 화가에게 말을 건다',
      check: socialCheck(30),
      success: {
        text: '화가는 붓을 멈추고 이 골목에서 30년을 살았다고 말한다. 예전엔 작은 공장들이 있었고, 예술가들이 들어오며 골목이 바뀌었다고. “变了很多，但是人还在。(많이 변했지만, 사람은 그대로예요.)”\n\n그가 이젤을 접으며 말한다. “我的工作室就在里面。来看看吧。(작업실이 바로 안쪽이에요. 와 봐요.)”',
        diary: '톈쯔팡의 화가와 이야기를 나누었다. 30년 동안 변한 골목 이야기를 듣고, 작업실에 초대받았다.',
        effects: {
          tags: ['sight:tianzifang', 'social:painter', 'culture:art_lanes'],
          knowledge: ['f_tianzifang'],
          count: ['zh'],
          stats: { social: 1 },
          setFlags: ['painter-invite'],
          followUp: 'E14C',
        },
      },
      failure: {
        text: '화가는 그림에 집중하느라 짧게 고개만 끄덕인다. 방해하지 않으려 한 발 물러나 붓끝을 잠시 지켜본다.',
        diary: '톈쯔팡에서 그림 그리는 화가의 붓끝을 잠시 지켜보았다.',
        effects: { tags: ['sight:tianzifang'] },
      },
    },
    {
      id: 'browse',
      text: '간판을 구경하며 큰 골목만 한 바퀴 돈다',
      success: {
        media: 'tianzifang-3',
        text: '은 장신구, 수제 비누, 고양이 그림 가게. 사람들 틈에서 구경하다 보니 처음 들어온 입구로 다시 나와 있다.',
        diary: '톈쯔팡의 큰 골목을 한 바퀴 돌며 가게들을 구경했다.',
        effects: { tags: ['sight:tianzifang'], stamina: -4 },
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

export const E14B: GameEvent = {
  id: 'E14B',
  title: '간판이 끊기는 곳',
  location: 'tianzifang',
  kind: 'followup',
  category: 'culture',
  media: ['tianzifang-2', 'tianzifang-1'],
  facts: ['f_lilong', 'f_tianzifang'],
  variants: [
    {
      when: [{ type: 'item', item: 'postcard' }],
      text: ['주머니 속 엽서를 꺼내 본다. 이 대문은 어디쯤일까.'],
    },
  ],
  intro: [
    '가게 간판이 끊기는 곳에서 한 번 더 꺾는다. 소리가 달라진다. 화로 위에서 무언가 끓는 소리, 라디오에서 흘러나오는 옛 노래, 위층 창문에서 빨래 장대를 내미는 소리.',
    '대나무 의자에 앉은 할아버지가 낯선 사람을 힐끔 본다. 골목 끝, 반쯤 열린 검은 대문 안쪽에 물감 묻은 이젤이 보인다.',
  ],
  choices: [
    {
      id: 'greet',
      text: '상하이 말로 인사한다 — “侬好!”',
      requires: [{ type: 'tagCount', prefix: 'culture:shanghainese', min: 1 }],
      success: {
        text: '“侬好(nóng hǎo)!” 할아버지의 눈이 동그래지더니 웃음이 터진다. 상하이 말로 무언가 빠르게 묻는다. 다 알아듣지는 못했지만 손짓은 분명하다. 앉으라고 의자를 내민다.\n\n잠시 라디오를 같이 듣다가 일어서자, 할아버지가 골목 끝 대문을 가리킨다. “画画的，好人。(그림 그리는 사람, 좋은 사람이야.)”',
        diary: '톈쯔팡 깊은 골목의 할아버지에게 상하이 말로 인사했더니 의자를 내주었다. 라디오를 같이 듣고, 골목 끝 화가의 작업실을 소개받았다.',
        effects: {
          tags: ['social:lilong_neighbor', 'hidden:resident_lane', 'culture:lilong_life'],
          knowledge: ['f_lilong'],
          stats: { social: 1 },
          followUp: 'E14C',
        },
      },
    },
    {
      id: 'postcard',
      text: '엽서 속 대문과 같은 대문을 찾아 걷는다',
      requires: [{ type: 'item', item: 'postcard' }],
      check: lookCheck(30),
      success: {
        text: '엽서를 손에 들고 대문을 하나씩 맞춰 본다. 문틀 위 아치의 꽃무늬, 왼쪽에 걸린 작은 우편함. 찾았다. 반쯤 열린 그 대문 안에서 물감 냄새가 흘러나온다. 엽서를 그린 사람이 저 안에 있다.',
        diary: '톈쯔팡에서 산 엽서 속 대문을 골목 깊은 곳에서 찾아냈다. 그 안이 화가의 작업실이었다.',
        effects: { tags: ['solve:postcard_door', 'hidden:resident_lane'], stamina: -4, followUp: 'E14C' },
      },
      failure: {
        text: '비슷한 대문이 너무 많다. 같은 골목을 두 번 돌고 나서야 엽서를 주머니에 넣는다. 그림 속 대문은 그림 속에 두기로 한다.',
        diary: '톈쯔팡 골목에서 엽서 속 대문을 찾다 같은 골목을 두 번 돌았다.',
        effects: { stamina: -8 },
      },
    },
    {
      id: 'bow',
      text: '조용히 목례하고 돌아 나온다',
      success: {
        media: 'tianzifang-2',
        text: '여기는 관광지가 아니라 누군가의 집 앞이다. 할아버지에게 가볍게 고개를 숙이고 왔던 길로 돌아 나온다. 등 뒤에서 라디오 소리가 조금 커진다.',
        diary: '톈쯔팡의 가장 깊은 골목에서 가게 대신 주민들의 일상을 만났다. 조용히 목례하고 돌아 나왔다.',
        effects: { tags: ['hidden:resident_lane', 'culture:lilong_life'], knowledge: ['f_lilong'], stamina: -6 },
      },
    },
    {
      id: 'easel',
      text: '반쯤 열린 대문 안을 들여다본다',
      success: {
        text: '고개를 들이밀자 안쪽에서 “进来吧！(들어와요!)” 하는 목소리가 들린다. 망설이다 문턱을 넘는다.',
        diary: '톈쯔팡 골목 끝, 반쯤 열린 대문 안을 들여다보다 안으로 초대받았다.',
        effects: { stamina: -2, followUp: 'E14C' },
      },
    },
  ],
}

export const E14C: GameEvent = {
  id: 'E14C',
  title: '물감 냄새 나는 작업실',
  location: 'tianzifang',
  kind: 'followup',
  category: 'culture',
  media: ['tianzifang-1', 'tianzifang-2'],
  facts: ['f_tianzifang'],
  variants: [
    {
      when: [{ type: 'flag', flag: 'painter-invite' }],
      text: ['골목 입구에서 만난 화가가 붓을 든 채 반긴다. “来了！(왔네요!)”'],
    },
    {
      when: [{ type: 'item', item: 'postcard' }],
      text: ['벽에 걸린 그림 하나가 주머니 속 엽서와 똑같다. 이 사람이 그렸다.'],
    },
  ],
  intro: [
    '스쿠먼 집 1층을 통째로 비운 작업실. 벽마다 이 골목을 그린 그림이 걸려 있다. 같은 대문, 같은 빨랫줄인데 계절과 시간이 모두 다르다.',
    '창가 탁자에는 엽서 크기의 스케치가 수북하다. 화가가 의자 하나를 끌어다 놓는다.',
  ],
  choices: [
    {
      id: 'sit',
      text: '의자에 앉아 모델이 되어 준다',
      success: {
        text: '화가가 연필을 쥐고 몇 번 눈을 가늘게 뜬다. 십 분쯤 지나자 종이 한 장을 내민다. 서툴게 웃고 있는 내 얼굴, 그 뒤로 이 작업실의 창과 골목. “送给你。(선물이에요.)”',
        diary: '톈쯔팡 화가의 작업실에서 모델이 되어 주고, 골목을 배경으로 한 내 얼굴 스케치를 선물받았다.',
        effects: { tags: ['culture:art_lanes'], addItems: ['portrait_sketch'], stamina: 6 },
      },
    },
    {
      id: 'story',
      text: '이 골목이 변해 온 이야기를 묻는다',
      check: socialCheck(25, [{ flag: 'painter-invite', bonus: 15 }]),
      success: {
        text: '화가는 벽의 그림을 하나씩 가리킨다. 공장 굴뚝이 있던 시절, 빈 창고에 처음 작업실이 들어선 해, 관광객이 몰려오기 시작한 해. “房子没变，用法变了。(집은 그대로인데, 쓰임이 바뀌었지.)”\n\n그림들이 이 골목의 연표다.',
        diary: '톈쯔팡 화가에게 벽에 걸린 그림으로 골목이 변해 온 이야기를 들었다. 집은 그대로이고 쓰임만 바뀌었다고 했다.',
        effects: { tags: ['social:painter', 'culture:art_lanes'], knowledge: ['f_tianzifang'], count: ['zh'], stats: { culture: 1 } },
      },
      failure: {
        text: '질문이 길어지자 화가가 미안한 얼굴로 붓을 든다. 마감이 있다고. 대신 벽의 그림들을 천천히 보고 가라며 손짓한다.',
        diary: '톈쯔팡 화가의 작업실에서 이야기를 길게 나누지는 못했지만, 벽의 그림들을 천천히 보았다.',
        effects: { tags: ['culture:art_lanes'], count: ['zh-try'] },
      },
    },
    {
      id: 'gift',
      text: '여행 중 산 선물 하나를 건넨다',
      requires: [
        {
          type: 'any',
          of: [
            { type: 'item', item: 'paper_cut' },
            { type: 'item', item: 'tea_leaves' },
            { type: 'item', item: 'ligaotang' },
            { type: 'item', item: 'incense' },
          ],
        },
      ],
      success: {
        text: '가방에서 꺼낸 작은 선물을 내밀자 화가가 두 손으로 받는다. 한참 들여다보더니 일어나 작업실 안쪽 문을 연다. 팔지 않는 그림들이 쌓인 방이다. 그중 한 장, 비 오는 날의 골목을 꺼내 보여 준다.\n\n“这个不卖，就给你看看。(이건 안 팔아요. 보여 주기만 하는 거예요.)”',
        diary: '톈쯔팡 화가에게 여행 중 산 선물을 건넸더니, 팔지 않는 그림들이 쌓인 안쪽 방을 보여 주었다.',
        effects: { tags: ['hidden:painter_studio', 'social:painter'], stats: { social: 1 } },
      },
    },
    {
      id: 'help',
      text: '약속대로 물감 개는 일을 돕는다',
      requires: [{ type: 'flag', flag: 'painter-invite' }],
      success: {
        text: '팔레트에 물감을 짜고, 붓을 빨고, 마른 캔버스를 벽에 기대어 세운다. 화가가 골목의 회색은 검정과 흰색이 아니라 파랑과 갈색을 섞어 만든다고 알려 준다. 손톱 밑이 회색으로 물든다.',
        diary: '톈쯔팡 화가의 작업실에서 물감 개는 일을 도우며, 골목의 회색을 파랑과 갈색으로 만든다는 것을 배웠다.',
        effects: { tags: ['culture:art_lanes', 'culture:lilong_life'], stats: { culture: 1 }, stamina: -6 },
      },
    },
  ],
}

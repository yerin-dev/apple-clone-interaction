(()=> {

  let yOffset = 0;  //pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이의 합
  let currentScene = 0; //현재 활성화된(눈 앞에 보고있는) 씬 (scroll-section)
  let enterNewScene = false; //새로운 씬이 시작되는 순간 true

  const sceneInfo = [
    {
      //0
      type: 'sticky',
      heightNum: 5, //브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
      },
      values: {
        messageA_opacity: [0, 1, {start:0.1, end:0.2}], //전체 애니메이션 진행에 대한 비율에서 등장시점과 끝나는 시점을 작성
        messageB_opacity: [0, 1, {start:0.3, end:0.4}],
      }
    },
    {
      //1
      type: 'normal',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      }
    },
    {
      //2
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
      }
    },
    {
      //3
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
      }
    },
  ];

  function setLayout(){
    //각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight; //window 생략 가능
      //각 요소의 높이를 scrollHeight로 지정
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;

    //새로고침 했을때 기존의 스크롤 양을 비교하여 currentScene을 다시 설정한다.
    let totalScrollHeight = 0;
    //인덱스별로 for문을 돈다.
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      //현재 스크롤값보다 지금까지 for문에서 계산한 총 높이가 클 경우 => i가 지금 바라보고 있는 대상의 인덱스(i)일때,
      //해당 active의 scene을 인덱스(i)로 바꿔준 후 for문을 중지한다.
      if(totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute('id', `show-scene-${currentScene}`);
  }

  function calcValues(values, currentYOffset) {
    let rv;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    //현재 씬 (스크롤섹션)에서 스크롤된 범위를 비율로 구하기
    const scrollRatio = currentYOffset / scrollHeight;


    //start ~ end 사이 애니메이션 실행
    if(values.length === 3) {
      //part 시작 비율 * 해당 섹션 전체 값 = 해당 시작부분의 값   ==> 787 * 0.2 하면 157.4가 나오듯이
      const partScrollStart = values[2].start * scrollHeight;
      //part 끝 비율 * 해당 섹션 전체 값 = 해당 끝 부분의 값   ==> 787 * 0.5 하면 393.5가 나오듯이
      const partScrollEnd = values[2].end * scrollHeight;
      // 그러면 787의 20%는 157.4부터 시작하여 50%인 393.5까지 **애니메이션의 범위의 값** 을 구할 수 있다.


      // ** 그러면 부분의 스크롤 총 값은 393.5 - 157.4 = 236.1이 그 부분의 대한 **총 스크롤 범위의 값**이다.
      const partScrollHeight = partScrollEnd - partScrollStart;


      //지금의 스크롤값이 part 시작부분과 part end 부분 사이에 있으면 (즉, 범위 안에 있을때)
      if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
        /*
        1 )
        currentYOffset => 섹션 안에 현재 위치의 절대 위치값 (431 ~ 795)
        partScrollStart => 모션 시작부분의 절대 위치값 (398)
        == 모션부분의 현재 값 => (0~397)

        2 )
        partScrollHeight => 모션부분의 총 값 (398)

        3 )
        rv = 12 / 398 => rv는 그 섹션 안에서의 비율

        * */
        rv =  (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];

      } else if (currentYOffset < partScrollStart) {
        //지금의 스크롤이 part 시작 범위보다 작으면 시작값으로 그냥 고정
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        //지금의 스크롤이 part 종료 범위보다 크면 끝값으로 그냥 고정
        rv = values[1];
      }

    } else {
      /*
      * 자, 만약 <values.messageA_opacity>가 200에서부터 900까지의 값이 증가한다고 가정했을때
      * (opacity 말고 다른 상황에서) ==> [200, 900],
      * 총 증가하는 값은 700이다. 그러면 [1]번째 값에서 [0]번째를 빼야 700이라는 값이 나올 것이다.
      * 그 후 시작하는 값은 200부터이니 시작값인 [0]번째를 더하게 되면 200부터 900까지 비율값으로 변하는 것을 구할 수 있다.
      * */
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  function playAnimation(){
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;

    switch (currentScene) {
      case 0:
        let messageA_opacity_in = calcValues(values.messageA_opacity, currentYOffset);
        objs.messageA.style.opacity = messageA_opacity_in;
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
    }
  }

  function scrollLoop(){
    enterNewScene = false;
    prevScrollHeight = 0;
    //처음부터 - 현재 scene까지의 scrollHeight를 더한다.
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    if(yOffset < prevScrollHeight) {
      enterNewScene = true;
      if(currentScene === 0) return;  //브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    if(enterNewScene) return;

    playAnimation();
  }

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  })

  //DOM 구조만 끝나면 로드한다, 실행시점이 빠르다.
  window.addEventListener('DOMContentLoaded', setLayout);
  window.addEventListener('resize', setLayout);
})();
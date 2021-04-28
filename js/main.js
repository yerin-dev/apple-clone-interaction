(()=> {

  let yOffset = 0;  //pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이의 합
  let currentScene = 0; //현재 활성화된(눈 앞에 보고있는) 씬 (scroll-section)

  const sceneInfo = [
    {
      //0
      type: 'sticky',
      heightNum: 5, //브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
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

  function scrollLoop(){
    prevScrollHeight = 0;
    //처음부터 - 현재 scene까지의 scrollHeight를 더한다.
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++;
    }

    if(yOffset < prevScrollHeight) {
      if(currentScene === 0) return;  //브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
      currentScene--;
    }

    document.body.setAttribute('id', `show-scene-${currentScene}`);
  }

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  })

  //DOM 구조만 끝나면 로드한다, 실행시점이 빠르다.
  window.addEventListener('DOMContentLoaded', setLayout);
  window.addEventListener('resize', setLayout);
})();
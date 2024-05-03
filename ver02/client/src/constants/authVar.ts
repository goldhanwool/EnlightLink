import { makeVar } from "@apollo/client";

//*----------------makeVar VS useReactiveVar----------------*/
//useReactiveVar는 리액티브 변수의 값을 읽기 위해 사용되는 React Hook
//-> 리액티브 변수의 값이 변경될 때마다 useReactiveVar를 사용하는 컴포넌트는 자동으로 리렌더링
//makeVar 함수를 사용하여 생성된 변수는 애플리케이션의 어느 곳에서나 접근할 수 있는 전역 상태를 제공
//-> 해당 변수를 구독하고 있는 모든 컴포넌트들은 자동으로 업데이트
//*--------------------------------------------------------*/

export const authVar = makeVar(false);
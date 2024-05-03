import { useEffect, useState } from "react";
import { router } from "../component/Routes";

const usePath = () => {
    const [path, setPath] = useState(window.location.pathname)

    useEffect(() => {
        const unsubscribe = router.subscribe((state) => {
            setPath(state.location.pathname)
        });
        console.log('[[usePath]] > path: ', path);
        // 컴포넌트 언마운트 시 구독 해제
        return unsubscribe;
    }, []);

    return { path };
}

export { usePath };
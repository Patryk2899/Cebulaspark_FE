import {FC, useEffect, useLayoutEffect, useState} from "react";
import Navbar from "../components/Navbar";
import {checkTokenValidity} from "../api/user";
import * as React from "react";


const MainPage: FC = () => {

    const [isLogged, setIsLogged] = useState(false);

    useLayoutEffect( () => {
        const checkToken = async () => {
            const result = await checkTokenValidity();
            setIsLogged(result)
        }
        checkToken().then()
    }, [isLogged]);

    return (
        <div>
            <Navbar isLoggedIn={isLogged}/>
        </div>
    )
}
export default MainPage;
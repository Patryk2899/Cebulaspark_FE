import {FC, useLayoutEffect, useState} from "react";
import Navbar from "../components/Navbar";
import {checkTokenValidity} from "../api/user";
import BargainCreateForm from "../components/BargainCreateForm";

const BargainCreatePage: FC = () => {

    const [isLogged, setIsLogged] = useState(false);

    const handleImageSubmit = (image: File) => {
        console.log('Submitted image:', image);
    };

    useLayoutEffect( () => {
        const checkToken = async () => {
            const result = await checkTokenValidity();
            setIsLogged(result)
        }
        checkToken().then()
    }, [isLogged]);

    return(
        <div>
            <Navbar isLoggedIn={isLogged}/>
            <BargainCreateForm onSubmit={handleImageSubmit}/>
        </div>
    )
};
export default BargainCreatePage
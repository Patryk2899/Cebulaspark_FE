import {checkTokenValidity} from "../api/user";
import LoggedInDropdown from "./LoggedInDropdown";
import LogInButton from "./LogInButton";


async function Avatar() {
    return await checkTokenValidity() ? <LoggedInDropdown/> : <LogInButton/>
}

export default Avatar
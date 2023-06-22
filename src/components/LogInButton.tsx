import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

function LogInButton() {

    const navigate = useNavigate();

    return (
        <Button
            onClick={() => {
                navigate("/")
            }}
            variant="contained"
            size="large"
        >
            Login
        </Button>
    )
}

export default LogInButton
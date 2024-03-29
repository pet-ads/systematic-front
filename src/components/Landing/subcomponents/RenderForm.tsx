import Login from "../Login";
import Register from "../Register";
import RecoverPassWord from "../RecoverPassWord";

interface iRenderFormProps {
  renderForm: string;
  setRenderForm: React.Dispatch<React.SetStateAction<string>>;
}
export default function RenderForm({ renderForm, setRenderForm }: iRenderFormProps) {
  switch (renderForm) {
    case "Login":
      return <Login handleRender={() => setRenderForm("Password")} />;
    case "Register":
      return <Register handleRender={() => setRenderForm("Login")} />;
    case "Password":
      return <RecoverPassWord handleRender={() => setRenderForm("Login")} />;
    default:
      return null;
  }
}

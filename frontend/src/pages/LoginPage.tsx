import { useNavigate } from "react-router";
import { LoginForm } from "../features/auth/ui/LoginForm";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui";

export const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center relative ">
      <div className="w-full max-w-md">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              Login
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Please enter your credentials to log in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/register")}
                className="text-blue-400 hover:text-blue-300 hover:bg-gray-800"
              >
                Register Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

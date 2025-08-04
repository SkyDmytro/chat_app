import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import { useNavigate } from "react-router";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen  bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Please enter your credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-blue-400 hover:text-blue-300 hover:bg-gray-800"
              >
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

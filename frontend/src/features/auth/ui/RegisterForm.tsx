import { Input, Label } from "@/shared/ui";
import { Button } from "@/shared/ui/";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useRegisterUser } from "../hooks/auth";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { registerUser } = useRegisterUser();
  const navigation = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;

    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;

    registerUser({ email, password, username }).then(() => {
      navigation("/login");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-gray-200">
          Username
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="username"
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-200">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-200">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        Register
      </Button>
    </form>
  );
}

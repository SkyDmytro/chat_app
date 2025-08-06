import { Mail, MessageCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Avatar } from "@/shared/ui/avatar";
import type { User } from "../models/types";

interface UserCardProps {
  user: User;
  onClick: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group">
      <CardContent className="p-6 pt-6">
        <div className="flex flex-col items-center text-center">
          <Avatar
            alt={user.username}
            fallback={user.username}
            className="h-16 w-16 mb-4"
          />

          <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
            {user.username}
          </h3>

          <div className="flex items-center gap-1 text-sm text-gray-400 mb-3">
            <Mail className="h-3 w-3" />
            <span className="truncate">{user.email}</span>
          </div>

          <Button
            onClick={onClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:bg-blue-500 transition-colors"
            size="sm"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Create Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

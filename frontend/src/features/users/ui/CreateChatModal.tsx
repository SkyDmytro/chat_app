import { X, MessageCircle, UserIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Avatar } from "@/shared/ui/avatar";
import type { User } from "../models/types";

interface CreateChatModalProps {
  user: User;
  onClose: () => void;
  onCreateChat: () => void;
}

export function CreateChatModal({
  user,
  onClose,
  onCreateChat,
}: CreateChatModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-gray-900 border-gray-800 w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-white flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            Create chat
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
            <Avatar
              src={`/placeholder.svg?height=60&width=60&query=${user.username}`}
              alt={user.username}
              fallback={user.username.charAt(0).toUpperCase()}
              className="h-12 w-12"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-white">{user.username}</h3>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
            <UserIcon className="h-5 w-5 text-gray-500" />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={onCreateChat}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Create chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

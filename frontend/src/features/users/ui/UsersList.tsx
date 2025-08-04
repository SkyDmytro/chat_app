import { Users } from "lucide-react";

import type { User } from "../models/types";
import { UserCard } from "./UserCard";
interface UsersListProps {
  onUserClick: (user: User) => void;
  users: User[];
}

export function UsersList({ onUserClick, users }: UsersListProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-white">Users</h1>
        </div>
        <p className="text-gray-400">Choose user to create chat with</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {users.length > 0 ? (
          users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onClick={() => onUserClick(user)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              Cant find any users
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

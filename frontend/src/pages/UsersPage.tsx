import { useAuthContext } from "@/features/auth/context/AuthContext";
import { useCreateChat } from "@/features/chat/hooks/useCreateChat";
import { useGetUsers } from "@/features/users/hooks/useGetUsers";
import { type User } from "@/features/users/models/types";
import { CreateChatModal } from "@/features/users/ui/CreateChatModal";
import { UsersList } from "@/features/users/ui/UsersList";
import { Button } from "@/shared/ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getUsers } = useGetUsers();
  const { createChat } = useCreateChat();

  const { user } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    getUsers()
      .then((res) => {
        setUsers(res);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleRedirectToChats = () => {
    navigate("/chats");
  };

  const handleCreateChat = async (chatName: string) => {
    console.log("Creating chat with user:", selectedUser);
    if (!selectedUser || !user) {
      return;
    }

    if (selectedUser.id == user.id) {
      return;
    }
    try {
      await createChat({ users: [user.id, selectedUser.id], name: chatName });
      handleCloseModal();
      navigate("/chats");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="w-full  border-b border-gray-800 mb-8">
        <div className="container mx-auto  flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-semibold text-white">Users</h2>
          <Button
            onClick={handleRedirectToChats}
            className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-700 shadow-none px-4 py-2 text-sm font-medium"
          >
            Return to Chats
          </Button>
        </div>
      </header>
      <UsersList onUserClick={handleUserClick} users={users} />

      {isModalOpen && selectedUser && (
        <CreateChatModal
          user={selectedUser}
          onClose={handleCloseModal}
          onCreateChat={handleCreateChat}
        />
      )}
    </div>
  );
};

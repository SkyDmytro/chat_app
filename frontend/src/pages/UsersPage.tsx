import { useAuthContext } from "@/features/auth/context/AuthContext";
import { useCreateChat } from "@/features/chat/hooks/useCreateChat";
import { useGetUsers } from "@/features/users/hooks/useGetUsers";
import { type User } from "@/features/users/models/types";
import { CreateChatModal } from "@/features/users/ui/CreateChatModal";
import { UsersList } from "@/features/users/ui/UsersList";
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
        console.log(res);
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

  const handleCreateChat = async () => {
    console.log("Creating chat with user:", selectedUser);
    if (!selectedUser || !user) {
      return;
    }

    if (selectedUser.id == user.id) {
      return;
    }
    try {
      await createChat({ users: [user.id, selectedUser.id], name: "New chat" });
      handleCloseModal();
      navigate("/chats");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
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

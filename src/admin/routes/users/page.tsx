import { Container, Button, Input } from "@medusajs/ui";
import { RouteConfig } from "@medusajs/admin";
import { useAdminCreateUser, useAdminUsers } from "medusa-react";
import { useState } from "react";

const Users = () => {
  const { users, isLoading } = useAdminUsers();
  const createUser = useAdminCreateUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateUser = () => {
    createUser.mutate({
      email,
      password,
    }, {
      onSuccess: ({ user }) => {
        console.log(user.id);
        // Optionally, clear the form or show a success message
        setEmail("");
        setPassword("");
        alert("User created successfully!");
      },
      onError: (error) => {
        // Handle error case
        console.error("Error creating user:", error);
        alert("Failed to create user.");
      }
    });
  };

  return (
    <Container>
            <div>
        <h3>Create User</h3>
        <Input 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter user's email"
        />
        <Input 
          
          type="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter user's password"
        />
        <Button onClick={handleCreateUser}>Create User</Button>
      </div>
       <div>
      {isLoading && <span>Loading...</span>}
      {users && !users.length && <span>No Users</span>}
      {users && users.length > 0 && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.email}</li>
          ))}
        </ul>
      )}
    </div>
    </Container>
  );
};

export const config: RouteConfig = {
  link: {
    label: "User Details",
    // icon: CustomIcon,
  },
};

export default Users;

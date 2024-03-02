import { useAdminDeleteUser } from "medusa-react"

type Props = {
  userId: string
}

const deleteUser = ({ userId }: Props) => {
  const deleteUser = useAdminDeleteUser(userId)
  // ...

  const handleDeleteUser = () => {
    deleteUser.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default deleteUser
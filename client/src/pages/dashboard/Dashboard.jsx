import useAuth from '../../hooks/useAuth'

function Dashboard() {
  const { user } = useAuth()

  return (
    <>
      <h2 className="fw-bold">Welcome, {user.name.split(' ')[0]}</h2>
      <p className="text-secondary">Your dashboard will appear here.</p>
    </>
  )
}

export default Dashboard
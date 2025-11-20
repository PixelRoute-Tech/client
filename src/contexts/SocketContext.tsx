import { useInitSocket } from '@/hooks/use-socket'

function SocketContext({children}) {
    useInitSocket()
  return children
}

export default SocketContext
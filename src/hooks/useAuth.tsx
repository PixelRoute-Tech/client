import { AuthContext } from "@/contexts/AuthContext"
import { useContext } from "react"

export const useAuth = ()=>{
    const authContext = useContext(AuthContext)
    if(Boolean(authContext)){
        return authContext
    }
    console.error("AuthContext must be used inside the AuthProvider")
    return null
}
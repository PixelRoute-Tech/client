import routes from "@/routes/routeList"
import { getItem, storageKeys } from "@/utils/storage"
import { redirect } from "react-router-dom"

export const authenticatedLoader = ()=>{
    const data = getItem(storageKeys.user)
    const token = getItem(storageKeys.accessToken)
    if(Boolean(data && token)){
        console.log("condition true")
        return data
    }else{
       console.log("condition false")
       throw redirect(localStorage.length == 0 ? `${routes.landing}` : `${routes.signout}`)
    }
}
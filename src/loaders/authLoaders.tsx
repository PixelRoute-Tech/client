import routes from "@/routes/routeList"
import { getItem, storageKeys } from "@/utils/storage"
import { redirect } from "react-router-dom"

export const authenticatedLoader = ()=>{
    const data = getItem(storageKeys.user)
    const token = getItem(storageKeys.token)
    if(Boolean(data && token)){
        return data
    }else{
       throw redirect(localStorage.length == 0 ? `${routes.login}` : `${routes.signout}`)
    }
}
import routes from "@/routes/routeList"
import { getItem, storageKeys } from "@/utils/storage"
import { redirect } from "react-router-dom"

export const authenticatedLoader = ()=>{
    const data = getItem(storageKeys.user)
    console.log(data)
    if(Boolean(data)){
        return data
    }else{
       throw redirect(`/${routes.login}`)
    }
}
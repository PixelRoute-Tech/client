export type UserType = {
       id: string;
       userName: string;
       shortName:string,
       userRole: string;
       designation: string;
       department: string;
       email: string;
       avatarUrl?: string;
       joinDate?: Date;
       rememberMe:boolean,
       password:string
}
export type AuthContextType = {
     user:UserType | null
     signin:(user:UserType)=>void,
     signout:(isLogout?:boolean)=>void
     loading:boolean,
     startLoading:()=>void
     stopLoading:()=>void
}
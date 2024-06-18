import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase";

export function useAuthstatus(){
     const[loggedIn,setloggedIn]=useState(false);
      const[checkingStatus,setCheckingStatus]=useState(true);
      useEffect(()=>{
          const unsubscribe=onAuthStateChanged(auth,(user)=>{
              setloggedIn(user?true:false);
              setCheckingStatus(false);
          });
            return()=>unsubscribe();
      },[])
      return [loggedIn,checkingStatus]

}
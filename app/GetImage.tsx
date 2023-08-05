'use client';

import { FormEvent, useState } from "react";

export default function GetImage() {
    const [image, setimage] = useState<string>("");
    const [psswd, setPsswd] = useState<string>("");
    const [error, setError] = useState<string>();
  
  function onSubmit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    if (image === "") {
        setError("Image name required");
    }
    else if(psswd === '') {
        setError("Password required");
    }
    else{
        location.href = `/api/image/?filename=${image}&password=${psswd}`
    }
  }

  return (
    <div className="justify-center items-center w-full h-full flex">
        <form className="grid grid-flow-row gap-4" onSubmit={onSubmit}>
            <label className="w-full">
                <div>Image name:</div>
                <input onChange={(e) => setimage(e.target.value)} value={image} className="text-black"></input>
            </label>
            <label className="w-full">
                <div>Password:</div>
                <input onChange={(e) => setPsswd(e.target.value)} value={psswd} className="text-black"></input>
            </label>
            <div className="text-center text-[#FF0F0F]">{typeof error === "undefined" ? "" : error}</div>
            <button type="submit">Get Image!</button>
        </form>
    </div>
  )
}

import React from 'react'
import { FileTypeId, findFileType } from '../../../helpers/chatConstants';


export default function RenderImage({ chatFile,url }) {
    return (
        <>
            {chatFile && FileTypeId.Image?.includes(findFileType(chatFile?.type)) &&
                <div className="text-center"  style={{ width: "100%", height: "100%", maxWidth:"400px", maxHeight:"400px", justifyContent:"center", alignContent:"center" }}>
                    <img src={URL.createObjectURL(chatFile)} alt={chatFile?.name} style={{ maxWidth: "400px", maxHeight:"400px", justifyContent:"center"}} />
                </div>}
            {
                url &&
                <div className="text-center">
                        <img src={url} alt={"message"} style={{ width: "100%", height: "100%", maxWidth:"400px", maxHeight:"400px", justifyContent:"center", alignContent:"center" }} />
                </div>

            }
            
        </>
    )
}
